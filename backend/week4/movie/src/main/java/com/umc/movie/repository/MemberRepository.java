package com.umc.movie.repository;

import com.umc.movie.entity.Member;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberRepository
        extends JpaRepository<Member, Long> {

    boolean existsByEmail(String email);

    boolean existsByNickname(String nickname);

    Optional<Member> findByEmail(String email);

    boolean existsByNicknameAndMemberIdNot(
            String nickname,
            Long memberId
    );
}