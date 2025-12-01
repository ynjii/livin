'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import HouseReviewCard from '@/components/House/HouseReviewCard';
import FloatingWriteButton from '@/components/Common/FloatingWriteButton';
import { getHouseReviewsApi, getHouseDetailApi } from '@apis/house';

interface HouseDetail {
  houseId: number;
  buildingName: string;
  address: string;
  parking: boolean;
  elevator: boolean;
  floor: number;
  type: 'PRIVATE' | 'BOARDING';
  options: string | null;
  lon: string;
  lat: string;
  imageUrl: string;
  place_url: string | null;
  phone: string | null;
  bookmarked: boolean;
}

interface HouseReview {
  id: number;
  createdAt: string;
  finalRate: number;
  facilityRate: 'BAD' | 'NORMAL' | 'GOOD' | 'VERY_GOOD';
  soundRate:
    | 'NONE'
    | 'SOMETIMES'
    | 'OFTEN'
    | 'BAD'
    | 'NORMAL'
    | 'GOOD'
    | 'VERY_GOOD';
  bugRate:
    | 'NONE'
    | 'SOMETIMES'
    | 'OFTEN'
    | 'BAD'
    | 'NORMAL'
    | 'GOOD'
    | 'VERY_GOOD';
  accessRate: 'BAD' | 'NORMAL' | 'GOOD' | 'VERY_GOOD';
  imageUrls: string[];
  nickname: string;
}

export default function BuildingDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [buildingInfo, setBuildingInfo] = useState('');
  const [reviews, setReviews] = useState<HouseReview[]>([]);
  const [houseDetail, setHouseDetail] = useState<HouseDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // 평점 계산
  const averageRating =
    reviews?.length > 0
      ? reviews.reduce((sum, review) => sum + review.finalRate, 0) /
        reviews.length
      : 0;

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;

      try {
        setLoading(true);

        // 건물 상세와 리뷰 목록 병렬 호출
        const [houseDetailData, reviewsData] = await Promise.all([
          getHouseDetailApi(params.id as string),
          getHouseReviewsApi(params.id as string),
        ]);

        setHouseDetail(houseDetailData);
        console.log('Reviews API Response:', reviewsData);
        // API 응답이 직접 배열로 오므로 content 없이 직접 사용
        setReviews(reviewsData || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <Wrapper>
        <Container>
          <Header>
            <BackButton onClick={() => router.back()}>
              <Image
                src='/arrow_back.svg'
                alt='뒤로가기'
                width={15}
                height={15}
              />
            </BackButton>
            <Title>로딩 중...</Title>
            <Spacer />
          </Header>
        </Container>
      </Wrapper>
    );
  }

  if (!houseDetail) {
    return (
      <Wrapper>
        <Container>
          <Header>
            <BackButton onClick={() => router.back()}>
              <Image
                src='/arrow_back.svg'
                alt='뒤로가기'
                width={15}
                height={15}
              />
            </BackButton>
            <Title>건물을 찾을 수 없습니다</Title>
            <Spacer />
          </Header>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <Header>
          <BackButton onClick={() => router.back()}>
            <Image
              src='/arrow_back.svg'
              alt='뒤로가기'
              width={15}
              height={15}
            />
          </BackButton>
          <Title>{houseDetail.buildingName}</Title>
          <Spacer />
        </Header>

        <BuildingImageLarge
          style={{
            backgroundImage: houseDetail.imageUrl
              ? `url(${houseDetail.imageUrl})`
              : 'none',
          }}
        />

        <BuildingInfoSection>
          <BuildingInfoText>
            {houseDetail.address}
            <br />
            지상 {houseDetail.floor}층, 주차{' '}
            {houseDetail.parking ? '가능' : '불가'}, 엘리베이터{' '}
            {houseDetail.elevator ? '있음' : '없음'}
            {houseDetail.options && (
              <>
                <br />
                옵션: {houseDetail.options}
              </>
            )}
          </BuildingInfoText>
        </BuildingInfoSection>

        <ReviewSection>
          <ReviewHeader>
            <ReviewTitle>
              리뷰 평점 {averageRating.toFixed(1)} · {reviews?.length || 0}개
            </ReviewTitle>
            <Stars>
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  key={star}
                  src={
                    star <= Math.floor(averageRating)
                      ? '/star.svg'
                      : '/star_unfilled.svg'
                  }
                  alt='star'
                  width={16}
                  height={16}
                />
              ))}
            </Stars>
            <ViewAllButton
              onClick={() => router.push(`/houses/review/${params.id}`)}
            >
              전체 보기
            </ViewAllButton>
          </ReviewHeader>

          <ReviewList>
            {reviews?.length > 0 ? (
              reviews.map((review) => (
                <HouseReviewCard
                  key={review.id}
                  date={new Date(review.createdAt).toLocaleDateString()}
                  name={review.nickname || '익명'}
                  score={review.finalRate}
                  stars={review.finalRate}
                  tags={[
                    houseDetail?.buildingName || '건물명',
                    houseDetail?.type === 'PRIVATE' ? '자취' : '하숙',
                  ].filter(Boolean)}
                  evaluations={{
                    방음: review.soundRate,
                    시설: review.facilityRate,
                    접근성: review.accessRate,
                    벌레: review.bugRate,
                  }}
                  onClick={() =>
                    router.push(
                      `/houses/review/${review.id}?houseId=${params.id}`
                    )
                  }
                  thumbnailUrl={
                    Array.isArray(review.imageUrls) && review.imageUrls[0]
                      ? review.imageUrls[0]
                      : undefined
                  }
                />
              ))
            ) : (
              <NoReviews>아직 리뷰가 없습니다.</NoReviews>
            )}
          </ReviewList>
        </ReviewSection>
      </Container>

      <FloatingWriteButton href={`/houses/write?houseId=${params.id}`} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 360px;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding-bottom: 120px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 0 20px;
  position: relative;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const Spacer = styled.div`
  width: 24px;
`;

const BuildingImageLarge = styled.div`
  width: 100%;
  height: 200px;
  background: #d9d9d9;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 16px;
  margin-bottom: 20px;
`;

const BuildingInfoSection = styled.div`
  width: 100%;
  margin-bottom: 24px;
  padding: 0;
`;

const BuildingInfoText = styled.div`
  width: 100%;
  min-height: 60px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.6;
  color: #333;
  font-family: inherit;
`;

const ReviewSection = styled.div`
  margin-top: 24px;
  margin-bottom: 20px;
  padding: 0;
  width: 100%;
`;

const ReviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

const ReviewTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #000;
  margin: 0;
`;

const Stars = styled.div`
  display: flex;
  gap: 2px;
`;

const ViewAllButton = styled.button`
  margin-left: auto;
  background: none;
  border: none;
  font-size: 13px;
  color: #666;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const NoReviews = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #999;
  font-size: 14px;
`;
