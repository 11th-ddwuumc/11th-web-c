package com.umc.movie.service;
import com.umc.movie.dto.RatingResponse;
import com.umc.movie.entity.Rating;
import com.umc.movie.repository.MemberRepository;
import com.umc.movie.repository.RatingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class RatingService {
    private final RatingRepository ratingRepository;
    private final MemberRepository memberRepository;
    public List<RatingResponse> getRatingsByMember(Long memberId, Integer page, Integer size) {
        if (!memberRepository.existsById(memberId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 유저입니다.");
        }
        List<Rating> ratings;
        if (page == null && size == null) {
            ratings = ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(memberId);
        } else {
            int pageNumber = page == null ? 0 : page;
            int pageSize = size == null ? 10 : size;
            ratings = ratingRepository.findByMember_MemberIdOrderByRatingIdDesc(
                    memberId, PageRequest.of(pageNumber, pageSize));
        }
        return ratings.stream().map(RatingResponse::from).toList();
    }
}
