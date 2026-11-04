type MemberRole = "leader" | "member";

interface StudyMember {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
}

const members: StudyMember[] = [
  {
    id: 1,
    name: "광수",
    role: "leader",
    githubId: "gwangsoo",
  },
  {
    id: 2,
    name: "지수",
    role: "member",
  },
];

function createMemberMessage(memberId: number) {
  const foundMember = members.find((member) => member.id === memberId);

  if (!foundMember) {
    return "회원을 찾지 못했어요.";
  }

  const githubId = foundMember.githubId ?? "등록되지 않음";

  return (
    foundMember.name +
    " 님의 역할은 " +
    foundMember.role +
    "이고, GitHub 아이디는 " +
    githubId +
    "입니다."
  );
}

console.log(createMemberMessage(1));
console.log(createMemberMessage(2));
console.log(createMemberMessage(999));



// 선택 미션 1
type StudyMemberType = {
  id: number;
  name: string;
  role: MemberRole;
  githubId?: string;
};


// 선택 미션 2
const studyHour: number | undefined = 0;

console.log(studyHour || 1);
console.log(studyHour ?? 1);


// 선택 미션 3
function formatMemberId(input: unknown) {
  if (typeof input === "number") {
    return "MEMBER-" + input;
  }

  if (typeof input === "string") {
    return input.toUpperCase();
  }

  return "회원 ID를 확인할 수 없어요.";
}

console.log(formatMemberId(1));
console.log(formatMemberId("member-02"));
console.log(formatMemberId(true));