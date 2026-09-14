type MemberRole = 'leader' | 'member';

type StudyMember = {
  memberId: number,
  name: string,
  role: MemberRole,
  githubId?: string,
}

const member1: StudyMember = {
  memberId: 1,
  name: 'kim',
  role: 'leader',
  githubId: 'kim123',
};

const member2: StudyMember = {
  memberId: 2,
  name: 'lee',
  role: 'member',
};

const memberList: StudyMember[] = [member1, member2];

function formatMemberId(input: unknown) {
  if (typeof input === 'string') {
    if (input.trim() === '') {
      return NaN;
    }
    return Number(input);
  } else if (typeof input === 'number') {
    return input;
  } else {
    return NaN;
  }
}

function printInfo(memberId: unknown, memberList: StudyMember[]) {
  const parsedMemberId = formatMemberId(memberId);

  if (isNaN(parsedMemberId)) {
    console.log(`memberId는 숫자여야 합니다 (${memberId})`);
    return;
  }

  let foundMember: StudyMember | undefined =
    memberList.find((member) => member.memberId === parsedMemberId);

  if (foundMember) {
    let memberInfo = '[회원정보]\nID = ' + foundMember.memberId + '\n'
      + '이름 = ' + foundMember.name + '\n'
      + '역할 = ' + foundMember.role + '\n'
      + '깃허브 = ' + (foundMember.githubId || '등록되지 않음') + '\n';
    console.log(memberInfo);

  } else {
    console.log(`회원 ID = [${memberId}] 인 회원은 찾을 수 없습니다.`);
  }
}

printInfo(1, memberList);
printInfo('2', memberList);
printInfo('abc', memberList);
printInfo('999', memberList);

const studyHour: number | undefined = 0;
console.log(studyHour || 1); // 1
console.log(studyHour ?? 1); // 0