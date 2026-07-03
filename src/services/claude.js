const API_URL = 'https://api.anthropic.com/v1/messages'
const ANTHROPIC_VERSION = '2023-06-01'
export const DEFAULT_MODEL = 'claude-sonnet-5'

// نجبر Claude على الرد عبر أداة (tool) بمخطط JSON محدد بدل تحليل نص حر،
// هذا يضمن استجابة صالحة دائمًا بدل الاعتماد على تنسيق النص.
const TRIP_PLAN_TOOL = {
  name: 'submit_trip_plan',
  description: 'تسليم خطة رحلة عائلية كاملة ومنظمة بصيغة JSON',
  input_schema: {
    type: 'object',
    required: ['flights', 'visas', 'accommodation', 'itinerary', 'budget', 'tips'],
    properties: {
      flights: {
        type: 'object',
        required: ['from_airport_name', 'to_airport_name', 'distance_to_center_km', 'duration_to_center_minutes', 'google_flights_url', 'notes'],
        properties: {
          from_airport_name: { type: 'string', description: 'اسم مطار الانطلاق' },
          to_airport_name: { type: 'string', description: 'اسم مطار الوجهة' },
          distance_to_center_km: { type: 'number', description: 'المسافة بالكيلومتر من المطار إلى مركز المدينة' },
          duration_to_center_minutes: { type: 'number', description: 'مدة التنقل بالدقائق من المطار إلى المركز' },
          google_flights_url: { type: 'string', description: 'رابط بحث جوجل فلايتس بين المدينتين والتاريخ المحدد' },
          notes: { type: 'string', description: 'ملاحظات عن أفضل وقت للحجز أو شركات طيران مناسبة للعائلات' },
        },
      },
      visas: {
        type: 'array',
        description: 'متطلبات التأشيرة لكل جنسية من جنسيات البالغين المسافرين',
        items: {
          type: 'object',
          required: ['nationality', 'required', 'type', 'processing_time', 'cost_estimate', 'notes'],
          properties: {
            nationality: { type: 'string' },
            required: { type: 'boolean', description: 'هل تتطلب تأشيرة مسبقة' },
            type: { type: 'string', description: 'نوع التأشيرة: عند الوصول، إلكترونية، سفارة، غير مطلوبة' },
            processing_time: { type: 'string' },
            cost_estimate: { type: 'string' },
            notes: { type: 'string' },
          },
        },
      },
      accommodation: {
        type: 'object',
        required: ['map_url', 'options'],
        properties: {
          map_url: { type: 'string', description: 'رابط خرائط جوجل لأفضل منطقة إقامة في المدينة' },
          options: {
            type: 'array',
            description: 'ثلاث فئات سكن بالضبط: اقتصادي، متوسط، فاخر',
            items: {
              type: 'object',
              required: ['category', 'name', 'area', 'price_per_night', 'description', 'map_url'],
              properties: {
                category: { type: 'string', enum: ['اقتصادي', 'متوسط', 'فاخر'] },
                name: { type: 'string' },
                area: { type: 'string' },
                price_per_night: { type: 'string' },
                description: { type: 'string' },
                map_url: { type: 'string' },
              },
            },
          },
        },
      },
      itinerary: {
        type: 'array',
        description: 'برنامج يومي مفصل بعدد أيام الرحلة',
        items: {
          type: 'object',
          required: ['day', 'date', 'title', 'transport', 'activities'],
          properties: {
            day: { type: 'number' },
            date: { type: 'string' },
            title: { type: 'string' },
            transport: { type: 'string', description: 'وسائل النقل المقترحة لليوم: مترو، تاكسي، مشي، إلخ' },
            activities: {
              type: 'array',
              items: {
                type: 'object',
                required: ['time', 'name', 'type', 'description', 'google_maps_url'],
                properties: {
                  time: { type: 'string' },
                  name: { type: 'string' },
                  type: { type: 'string', enum: ['معلم', 'مطعم', 'تسوق', 'نقل'] },
                  description: { type: 'string' },
                  halal: { type: 'boolean', description: 'صالح فقط لعناصر من نوع مطعم' },
                  google_maps_url: { type: 'string' },
                },
              },
            },
          },
        },
      },
      budget: {
        type: 'object',
        required: ['currency', 'items', 'total'],
        properties: {
          currency: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              required: ['category', 'amount', 'notes'],
              properties: {
                category: { type: 'string' },
                amount: { type: 'string' },
                notes: { type: 'string' },
              },
            },
          },
          total: { type: 'string' },
        },
      },
      tips: {
        type: 'array',
        items: { type: 'string' },
      },
    },
  },
}

function buildPrompt(trip) {
  const adultsList = trip.adults
    .map((a, i) => `  ${i + 1}. جنسية: ${a.nationality}`)
    .join('\n')
  const childrenList = trip.children.length
    ? trip.children.map((c, i) => `  ${i + 1}. العمر: ${c.age} سنة`).join('\n')
    : '  لا يوجد أطفال'

  return `خطّط رحلة عائلية بالتفصيل بناءً على المعطيات التالية:

- مدينة المغادرة: ${trip.departureCity}
- الوجهة: ${trip.destinationCity}, ${trip.destinationCountry}
- تاريخ السفر: ${trip.travelDate}
- عدد أيام الرحلة: ${trip.numberOfDays}
- البالغون (${trip.adults.length}):
${adultsList}
- الأطفال (${trip.children.length}):
${childrenList}

المطلوب تسليمه عبر أداة submit_trip_plan:
1. تفاصيل الطيران: المسافة من المطار إلى مركز المدينة، ورابط بحث حقيقي وصالح على Google Flights.
2. متطلبات التأشيرة لكل جنسية من جنسيات البالغين المذكورة أعلاه.
3. ثلاث خيارات سكن (اقتصادي، متوسط، فاخر) مع رابط خرائط جوجل لكل خيار ورابط عام لمنطقة الإقامة الأفضل.
4. برنامج يومي كامل لعدد الأيام المحدد، يتضمن لكل يوم: وسيلة النقل المناسبة (مترو أو تاكسي)، معالم سياحية مناسبة للعائلات، مطاعم حلال (halal: true)، وأماكن تسوق، مع رابط خرائط جوجل صحيح لكل نشاط.
5. ميزانية تفصيلية تشمل الطيران والسكن والطعام والتنقل والأنشطة والتسوق، بعملة مناسبة، لكامل العائلة (${trip.adults.length} بالغين و ${trip.children.length} أطفال) طوال ${trip.numberOfDays} أيام.
6. نصائح عملية للسفر العائلي إلى هذه الوجهة (ثقافية، صحية، تتعلق بالأطفال).

اجعل جميع الروابط بصيغة روابط بحث جوجل مابس أو جوجل فلايتس صالحة الشكل (مثال: https://www.google.com/maps/search/?api=1&query=...).
أجب بالعربية فقط.`
}

export async function generateTripPlan({ apiKey, trip, model = DEFAULT_MODEL }) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: 8000,
      tools: [TRIP_PLAN_TOOL],
      tool_choice: { type: 'tool', name: 'submit_trip_plan' },
      messages: [{ role: 'user', content: buildPrompt(trip) }],
    }),
  })

  if (!response.ok) {
    const errBody = await response.json().catch(() => null)
    const message = errBody?.error?.message || `فشل الطلب برمز ${response.status}`
    throw new Error(message)
  }

  const data = await response.json()
  const toolUse = data.content?.find((block) => block.type === 'tool_use' && block.name === 'submit_trip_plan')
  if (!toolUse) {
    throw new Error('لم يستطع Claude إنشاء خطة منظمة، حاول مجددًا')
  }
  return toolUse.input
}
