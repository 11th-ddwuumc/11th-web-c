package com.umc.movie.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(
        name = "member",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_member_email",
                        columnNames = "email"
                ),
                @UniqueConstraint(
                        name = "uk_member_nickname",
                        columnNames = "nickname"
                )
        }
)
public class Member extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "member_id")
    private Long memberId;

    @Column(
            nullable = false,
            unique = true,
            length = 254
    )
    private String email;

    @Column(
            nullable = false,
            length = 60
    )
    private String password;

    @Column(
            nullable = false,
            unique = true,
            length = 50
    )
    private String nickname;

    @Builder
    public Member(
            String email,
            String password,
            String nickname
    ) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
    }

    // 7주차: 내 정보 수정에서 사용
    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }
}