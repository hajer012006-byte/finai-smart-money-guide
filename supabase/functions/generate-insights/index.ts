import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { expenses, monthlyIncome } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Prepare expense summary
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + Number(e.amount), 0);
    const categoryBreakdown = expenses.reduce((acc: any, e: any) => {
      acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
      return acc;
    }, {});

    const currentMonth = new Date().getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    
    const currentMonthExpenses = expenses
      .filter((e: any) => new Date(e.date).getMonth() === currentMonth)
      .reduce((sum: number, e: any) => sum + Number(e.amount), 0);
    
    const previousMonthExpenses = expenses
      .filter((e: any) => new Date(e.date).getMonth() === previousMonth)
      .reduce((sum: number, e: any) => sum + Number(e.amount), 0);

    const systemPrompt = `أنت مستشار مالي ذكي. قم بتحليل البيانات المالية التالية وقدم 3 رؤى مفيدة باللغة العربية.
    
البيانات:
- الدخل الشهري: ${monthlyIncome} جنيه
- إجمالي المصروفات: ${totalExpenses} جنيه
- مصروفات الشهر الحالي: ${currentMonthExpenses} جنيه
- مصروفات الشهر السابق: ${previousMonthExpenses} جنيه
- توزيع المصروفات: ${JSON.stringify(categoryBreakdown)}

قدم 3 رؤى فقط من النوعين: warning (تحذير) أو success (نجاح) أو info (معلومة).`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: "قدم لي 3 رؤى ذكية عن وضعي المالي" }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_insights",
              description: "توفير رؤى مالية ذكية",
              parameters: {
                type: "object",
                properties: {
                  insights: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        type: { type: "string", enum: ["warning", "success", "info"] },
                        title: { type: "string" },
                        description: { type: "string" }
                      },
                      required: ["type", "title", "description"],
                      additionalProperties: false
                    }
                  }
                },
                required: ["insights"],
                additionalProperties: false
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "provide_insights" } }
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "تم تجاوز حد الطلبات، يرجى المحاولة لاحقاً" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "يرجى إضافة رصيد إلى حسابك" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      const insights = JSON.parse(toolCall.function.arguments);
      return new Response(JSON.stringify(insights), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback insights if AI fails
    return new Response(
      JSON.stringify({
        insights: [
          {
            type: "info",
            title: "تحليل مصروفاتك",
            description: `أنفقت ${currentMonthExpenses} جنيه هذا الشهر من أصل ${monthlyIncome} جنيه دخل شهري.`
          },
          {
            type: currentMonthExpenses < previousMonthExpenses ? "success" : "warning",
            title: currentMonthExpenses < previousMonthExpenses ? "تحسن في الإنفاق" : "زيادة في الإنفاق",
            description: `مصروفاتك ${currentMonthExpenses < previousMonthExpenses ? "انخفضت" : "زادت"} مقارنة بالشهر السابق.`
          },
          {
            type: monthlyIncome - currentMonthExpenses > 0 ? "success" : "warning",
            title: monthlyIncome - currentMonthExpenses > 0 ? "لديك مدخرات" : "تجاوزت الميزانية",
            description: monthlyIncome - currentMonthExpenses > 0 
              ? `وفرت ${monthlyIncome - currentMonthExpenses} جنيه هذا الشهر!`
              : "حاول تقليل المصروفات للوصول لأهدافك."
          }
        ]
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "حدث خطأ غير متوقع" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
