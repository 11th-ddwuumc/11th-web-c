
package com.umc.movie.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(
        name = "rating",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_rating_member_movie",
                        columnNames = {"member_id", "movie_id"}
                )
        }
)
public class Rating extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "rating_id")
    private Long ratingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private Member member;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    // MySQL TINYINT 타입과 매핑
    @JdbcTypeCode(SqlTypes.TINYINT)
    @Column(nullable = false)
    private Integer score;

    // 기존 MySQL TEXT 타입과 매핑
    @Column(columnDefinition = "TEXT")
    private String comment;

    @Builder
    public Rating(
            Member member,
            Long movieId,
            Integer score,
            String comment
    ) {
        this.member = member;
        this.movieId = movieId;
        this.score = score;
        this.comment = comment;
    }

    public void update(Integer score, String comment) {
        this.score = score;
        this.comment = comment;
    }
}
