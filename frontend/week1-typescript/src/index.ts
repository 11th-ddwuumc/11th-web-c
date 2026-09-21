type Role = "member" | "leader";

interface Member {
    id: number;
    name: string;
    role: Role;
    githubId?: string;
}

const members: Member[] = [
    { id: 1, name: "강서윤", role: "leader", githubId: "CreamMatcha" },
    { id: 2, name: "티아", role: "member" },
];

function findMember(id: number): Member | undefined {
    return members.find((member) => member.id === id);
}

function getMemberIntro(id: number): string {
    const member = findMember(id);

    if (!member) {
        return `ID ${id}에 해당하는 회원을 찾을 수 없습니다.`;
    }

    const githubText = member.githubId
        ? `GitHub: ${member.githubId}`
        : "등록되지 않은 GitHub ID입니다.";

    return `${member.name} (${member.role}) - ${githubText}`;
}

console.log(getMemberIntro(1));
console.log(getMemberIntro(2));
console.log(getMemberIntro(999));