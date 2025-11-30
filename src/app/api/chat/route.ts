export const maxDuration = 30;

// 시나리오별 목업 응답
const mockResponses: Record<string, string> = {
  "가스": `🚨 **긴급: D구역 가스 누출 대응 지침**

**즉각 조치사항:**
1. D구역 내 모든 작업자 즉시 대피 (비상구: 북측 출입문)
2. 중앙관제실 연락 (내선 100)
3. 가스 차단 밸브 확인 및 차단

**안전 장비:**
- 방독면 착용 필수
- 정전기 방지 장갑 착용
- 화기 사용 금지

**대피 경로:**
D구역 → 북측 비상구 → E구역 집결지

**연락처:**
- 중앙관제실: 내선 100
- 소방서: 119
- 안전관리팀: 내선 200`,

  "화재": `🔥 **긴급: B구역 화재 대응 지침**

**즉각 조치사항:**
1. 화재 경보 발령
2. B구역 전원 차단
3. 초기 진화 시도 (소화기 사용)
4. 진화 불가 시 즉시 대피

**대피 경로:**
B구역 터빈동 → 서측 비상계단 → 1층 정문 → 주차장 집결지

**소화기 위치:**
- 터빈동 1층 입구 (분말소화기)
- 제어실 내부 (CO2 소화기)
- 비상계단 입구 (분말소화기)

**연락처:**
- 소방서: 119
- 중앙관제실: 내선 100
- 의료팀: 내선 119`,

  "쓰러": `🏥 **긴급: C구역 작업자 응급상황 대응 지침**

**즉각 조치사항:**
1. 의료팀 호출 (내선 119)
2. 환자 상태 확인 (의식, 호흡, 맥박)
3. 기도 확보 및 안정된 자세 유지
4. AED 준비 (C구역 입구 벽면)

**응급처치:**
- 의식 없음: 회복 자세로 전환
- 호흡 없음: 심폐소생술(CPR) 시작
- 출혈 시: 직접 압박 지혈

**AED 위치:**
C구역 변전설비 입구 벽면 (빨간색 함)

**연락처:**
- 의료팀: 내선 119
- 119 구급대: 119
- 안전관리팀: 내선 200`,

  "안전모": `⛑️ **주의: A구역 안전모 미착용 대응 지침**

**즉각 조치사항:**
1. 해당 작업자 확인 및 안전모 착용 안내
2. 안전모 미비 시 여분 지급
3. 반복 위반 시 안전교육 권장

**안전모 비치 위치:**
- A구역 입구 안전장비함
- 관리동 안전관리실

**관련 규정:**
- 산업안전보건법 제32조
- 사내 안전수칙 제5조

**권고사항:**
- 작업 전 안전장비 점검 습관화
- 안전모 턱끈 반드시 체결

**연락처:**
- 안전관리팀: 내선 200`,
};

// 기본 응답
const defaultResponse = `📋 **AI 안전 가이드 응답**

질문을 분석했습니다. 아래 정보를 참고해주세요.

**발전소 구역 정보:**
- A구역: 보일러동
- B구역: 터빈동
- C구역: 변전설비
- D구역: 연료저장
- E구역: 냉각탑
- F구역: 관리동

**긴급 연락처:**
- 중앙관제실: 내선 100
- 소방서: 119
- 의료팀: 내선 119
- 안전관리팀: 내선 200

구체적인 상황(가스 누출, 화재, 작업자 쓰러짐, 안전모 미착용 등)을 말씀해주시면 더 정확한 대응 지침을 안내해드립니다.`;

function getMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("가스") || lowerMessage.includes("누출")) {
    return mockResponses["가스"];
  }
  if (lowerMessage.includes("화재") || lowerMessage.includes("연기") || lowerMessage.includes("불")) {
    return mockResponses["화재"];
  }
  if (lowerMessage.includes("쓰러") || lowerMessage.includes("응급") || lowerMessage.includes("의식")) {
    return mockResponses["쓰러"];
  }
  if (lowerMessage.includes("안전모") || lowerMessage.includes("헬멧") || lowerMessage.includes("미착용")) {
    return mockResponses["안전모"];
  }

  return defaultResponse;
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  const lastMessage = messages[messages.length - 1];

  // 목업 응답 생성
  const response = getMockResponse(lastMessage.content);

  // 스트리밍 형식으로 응답 (글자 단위로 전송)
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // 응답을 청크 단위로 전송
      const chunks = response.split("");
      for (let i = 0; i < chunks.length; i += 3) {
        const chunk = chunks.slice(i, i + 3).join("");
        controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}
`));
        await new Promise(resolve => setTimeout(resolve, 10)); // 자연스러운 타이핑 효과
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
