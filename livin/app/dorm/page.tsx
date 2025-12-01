'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import NavigationBar from '@/components/NavigationBar/NavigationBar';
import DormReviewCard from '@/components/Dorm/DormReviewCard';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getDormReviewsApi } from '@apis/dorm';

type FilterType = '평점' | '기숙사 건물' | '기숙사 동' | null;

export default function DormPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterType>(null);
  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedDong, setSelectedDong] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 건물별 동 매핑
  const buildingToDongs: Record<string, string[]> = {
    'E-House': ['201동', '202동', '203동', '204동', '301동', '302동', '303동', '304동'],
    '한우리집': ['101동', '102동', '103동'],
    'I-House': ['A동', 'B동', 'C동', 'D동']
  };

  // 현재 선택된 건물에 따른 동 목록
  const getAvailableDongs = () => {
    if (selectedBuilding && buildingToDongs[selectedBuilding]) {
      return buildingToDongs[selectedBuilding];
    }
    // 건물이 선택되지 않았으면 모든 동 표시
    return Object.values(buildingToDongs).flat();
  };

  // 리뷰 목록 조회
  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      
      const params: {
        buildName?: string;
        buildNum?: string;
        minFinalRate?: number;
      } = {};
      
      // 검색어가 있으면 buildName으로 검색
      if (searchText.trim()) {
        params.buildName = searchText.trim();
      }
      
      // 선택된 목록 필터링 적용
      if (selectedBuilding) {
        params.buildName = selectedBuilding;
      }
      
      if (selectedDong) {
        params.buildNum = selectedDong;
      }
      
      if (selectedRating > 0) {
        params.minFinalRate = selectedRating;
      }
      
      const data = await getDormReviewsApi(params);
      console.log('API Response:', data);
      console.log('API Params:', params);
      
      if (Array.isArray(data)) {
        setReviews(data);
        console.log('Reviews loaded:', data.length);
      } else {
        console.log('Unexpected data structure:', data);
        setReviews([]);
      }
    } catch (error: any) {
      console.error('리뷰 조회 실패:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);
  
  // 필터나 검색어 변경 시 자동 검색
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchReviews();
    }, 300);
    
    return () => clearTimeout(delayedSearch);
  }, [searchText, selectedBuilding, selectedDong, selectedRating]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      fetchReviews();
    }
  };
  
  const handleClearSearch = () => {
    setSearchText('');
  };

  return (
    <>
      <Wrapper onClick={() => setActiveFilter(null)}>
        <Header>
          <BackBtn onClick={() => router.back()}>
            <Image src='/arrow_back.svg' width={9} height={15} alt='back' />
          </BackBtn>
          <Title>기숙사 리뷰 조회</Title>
        </Header>

        {/* 검색 */}
        <SearchSection>
          <SearchInputWrapper>
            <SearchIcon
              src='/search.svg'
              alt='검색'
              width={20}
              height={20}
            />
            <SearchInput 
              placeholder='원하는 기숙사를 검색해주세요'
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyPress={handleSearch}
            />
          </SearchInputWrapper>
        </SearchSection>

        {/* 필터 */}
        <FilterSection>
          <FilterButtonWrapper onClick={(e) => e.stopPropagation()}>
            <FilterButton
              $active={activeFilter === '평점'}
              onClick={(e) => {
                e.stopPropagation();
                setActiveFilter(activeFilter === '평점' ? null : '평점');
              }}
            >
              평점
            </FilterButton>
            {activeFilter === '평점' && (
              <FilterPopupFloating>
                <PopupTitle>평점</PopupTitle>
                <StarRating>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      $selected={selectedRating >= star}
                      onClick={() => setSelectedRating(star)}
                    >
                      <Image
                        src={
                          selectedRating >= star
                            ? '/star.svg'
                            : '/star_unfilled.svg'
                        }
                        alt='star'
                        width={28}
                        height={28}
                      />
                    </Star>
                  ))}
                </StarRating>
                <PopupDescription>
                  {selectedRating > 0
                    ? `평점 ${selectedRating}점 이상의 리뷰만 조회합니다.`
                    : '평점을 선택해주세요.'}
                </PopupDescription>
              </FilterPopupFloating>
            )}
          </FilterButtonWrapper>

          <FilterButtonWrapper onClick={(e) => e.stopPropagation()}>
            <FilterButton
              $active={activeFilter === '기숙사 건물'}
              onClick={(e) => {
                e.stopPropagation();
                setActiveFilter(
                  activeFilter === '기숙사 건물' ? null : '기숙사 건물'
                );
              }}
            >
              기숙사 건물
            </FilterButton>
            {activeFilter === '기숙사 건물' && (
              <FilterPopupFloating>
                <PopupTitle>기숙사 건물</PopupTitle>
                <OptionList>
                  {['E-House', 'I-House', '한우리집'].map((building) => (
                    <OptionButton
                      key={building}
                      $selected={selectedBuilding === building}
                      onClick={() => {
                        const newBuilding = building === selectedBuilding ? '' : building;
                        setSelectedBuilding(newBuilding);
                        // 건물 변경 시 동 선택 초기화
                        setSelectedDong('');
                      }}
                    >
                      {building}
                    </OptionButton>
                  ))}
                </OptionList>
              </FilterPopupFloating>
            )}
          </FilterButtonWrapper>

          <FilterButtonWrapper onClick={(e) => e.stopPropagation()}>
            <FilterButton
              $active={activeFilter === '기숙사 동'}
              onClick={(e) => {
                e.stopPropagation();
                setActiveFilter(
                  activeFilter === '기숙사 동' ? null : '기숙사 동'
                );
              }}
            >
              기숙사 동
            </FilterButton>
            {activeFilter === '기숙사 동' && (
              <FilterPopupFloating $alignRight>
                <PopupTitle>기숙사 동</PopupTitle>
                <OptionGrid>
                  {getAvailableDongs().map(
                    (dong) => (
                      <OptionButton
                        key={dong}
                        $selected={selectedDong === dong}
                        onClick={() =>
                          setSelectedDong(dong === selectedDong ? '' : dong)
                        }
                      >
                        {dong}
                      </OptionButton>
                    )
                  )}
                </OptionGrid>
              </FilterPopupFloating>
            )}
          </FilterButtonWrapper>
        </FilterSection>

        {/* 리스트 */}
        <ScrollArea>
          <ReviewList>
            {isLoading ? (
              <LoadingText>로딩 중...</LoadingText>
            ) : reviews.length > 0 ? (
              reviews.map((review) => (
                <div key={review.id}>
                  <DormReviewCard
                    date={review.createdAt}
                    name={review.nickname || '익명'}
                    score={review.finalrate || 0}
                    stars={review.finalrate || 0}
                    tags={[review.buildName, review.buildNum, `${review.roomPeople}인실`].filter(Boolean)}
                    evaluations={{
                      방음: review.soundRate || '-',
                      시설: review.facilityRate || '-',
                      접근성: review.accessRate || '-',
                      벌레: review.bugRate || '-',
                    }}
                    onClick={() => router.push(`/dorm/${review.id}`)}
                    thumbnailUrl={
                      Array.isArray(review.imageUrls) && review.imageUrls[0]
                        ? review.imageUrls[0]
                        : undefined
                    }
                  />
                </div>
              ))
            ) : (
              <EmptyText>등록된 리뷰가 없습니다.</EmptyText>
            )}
          </ReviewList>
        </ScrollArea>

        <FloatingButton onClick={() => router.push('/dorm/write')}>
          <Image src='/writing.svg' alt='리뷰 작성' width={28} height={28} />
          <span>리뷰 작성</span>
        </FloatingButton>
      </Wrapper>
      <NavigationBar />
    </>
  );
}

const Wrapper = styled.div`
  width: 100%;
  max-width: 360px;
  height: 800px;
  background: ${({ theme }) => theme.colors.background};
  padding: 50px 20px 0;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 16px;
  margin-bottom: 20px;
`;

const BackBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  z-index: 10;

  outline: none;
  -webkit-tap-highlight-color: transparent;
`;

const Title = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  color: #000;
  font-family: ${({ theme }) => theme.fonts.main};
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  white-space: nowrap;
`;

const SearchSection = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 320px;
`;

const SearchIcon = styled(Image)`
  position: absolute;
  left: 16px;
  opacity: 0.5;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 35px;
  padding: 0 16px 0 48px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  background: #fff;
  font-size: 13px;
  color: #000;

  &::placeholder {
    color: #b6b6b6;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow: visible;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterButtonWrapper = styled.div`
  position: relative;
  z-index: 100;
`;

const FilterButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  height: 28px;
  padding: 6px 14px;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
  border: 1px solid
    ${({ $active, theme }) => ($active ? theme.colors.primary : '#d0d0d0')};
  background: ${({ $active, theme }) =>
    $active ? theme.colors.primary : '#fff'};
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  font-size: 11px;
  font-weight: ${({ $active }) => ($active ? '500' : '400')};
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.primary : '#f8f8f8'};
    border-color: ${({ $active, theme }) =>
      $active ? theme.colors.primary : '#b0b0b0'};
  }
`;

const FilterPopup = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const PopupContent = styled.div`
  width: 100%;
  padding: 18px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
`;

const FilterPopupFloating = styled.div<{ $alignRight?: boolean }>`
  position: absolute;
  top: calc(100% + 8px);
  left: ${({ $alignRight }) => ($alignRight ? '50%' : '0')};
  right: auto;
  transform: ${({ $alignRight }) =>
    $alignRight ? 'translateX(-50%)' : 'none'};
  min-width: 200px;
  padding: 16px;
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: ${({ $alignRight }) =>
        $alignRight ? 'translateX(-50%) translateY(-4px)' : 'translateY(-4px)'};
    }
    to {
      opacity: 1;
      transform: ${({ $alignRight }) =>
        $alignRight ? 'translateX(-50%) translateY(0)' : 'translateY(0)'};
    }
  }
`;

const PopupTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: #000;
  margin: 0 0 12px 0;
`;

const StarRating = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const Star = styled.div<{ $selected?: boolean }>`
  cursor: pointer;
  transition: transform 0.2s;
  opacity: ${({ $selected }) => ($selected ? 1 : 0.3)};

  &:hover {
    transform: scale(1.15);
    opacity: 1;
  }
`;

const PopupDescription = styled.p`
  font-size: 10px;
  color: #818181;
  text-align: center;
  margin: 0;
`;

const OptionList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const OptionButton = styled.button<{ $selected?: boolean }>`
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid
    ${({ $selected, theme }) => ($selected ? theme.colors.primary : '#e0e0e0')};
  background: ${({ $selected, theme }) =>
    $selected ? theme.colors.primary : '#fff'};
  color: ${({ $selected }) => ($selected ? '#fff' : '#333')};
  font-size: 11px;
  font-weight: ${({ $selected }) => ($selected ? '500' : '400')};
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &:hover {
    background: ${({ $selected, theme }) =>
      $selected ? theme.colors.primary : '#f8f8f8'};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ReviewList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 20px;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
`;

const EmptyText = styled.div`
  text-align: center;
  padding: 40px 0;
  color: #999;
  font-size: 14px;
`;


const FloatingButton = styled.button`
  position: fixed;
  bottom: 120px;
  right: calc(50% - 180px + 12px);
  width: 71px;
  height: 71px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 400;

  span {
    color: #fff;
    font-size: 10px;
    font-weight: 500;
  }

  img {
    filter: brightness(0) invert(1);
  }

  &:hover {
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  transition: transform 0.2s;
`;

// 리뷰 썸네일 이미지 리스트
const ImageList = styled.div`
  display: flex;
  gap: 10px;
  margin: 8px 0 16px 0;
`;

const ReviewImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  background: #f5f5f5;
`;
