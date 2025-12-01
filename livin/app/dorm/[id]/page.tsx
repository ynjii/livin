'use client';

import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import StarDisplay from '@/components/Dorm/StarDisplay';
import EvaluationList from '@/components/Dorm/EvaluationList';

import { getDormReviewDetailApi, deleteDormReviewApi } from '@apis/dorm';
import {
  createCommentApi,
  deleteCommentApi,
  getCommentsApi,
} from '@apis/comment';

// 댓글 타입 정의
interface Comment {
  commentId: number;
  nickname: string;
  content: string;
  createdAt: string;
}

interface Review {
  id: number;
  buildName: string;
  buildNum: string;
  roomPeople: number;
  review: string;
  finalRate: number;
  facilityRate: string;
  soundRate: string;
  bugRate: string;
  accessRate: string;
  imageUrls: string[];
  createdAt?: string;
  nickname?: string;
  anonym?: boolean;
}

export default function DormDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [review, setReview] = useState<Review | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const loadReviewData = async () => {
    try {
      setIsLoading(true);
      const reviewId = Number(params.id);
      const data = await getDormReviewDetailApi(reviewId);
      setReview(data);
      // 댓글 데이터
      const commentsData = await getCommentsApi(reviewId);
      setComments(commentsData.comments);
    } catch (error) {
      console.error('리뷰 또는 댓글 데이터 불러오기 실패:', error);
      alert('리뷰를 찾을 수 없습니다.');
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      loadReviewData();
    }
  }, [params.id]);

  // 댓글 작성
  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setIsSubmittingComment(true);
      const reviewId = Number(params.id);
      await createCommentApi(reviewId, {
        content: commentText,
        anonymous: isAnonymous,
      });
      // 댓글 목록 새로고침
      const commentsData = await getCommentsApi(reviewId);
      setComments(commentsData.comments);
      setCommentText('');
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      const reviewId = Number(params.id);
      await deleteCommentApi(commentId);
      // 댓글 목록 새로고침
      const commentsData = await getCommentsApi(reviewId);
      setComments(commentsData.comments);
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // 리뷰 삭제
  const handleDeleteReview = async () => {
    if (!confirm('리뷰를 삭제하시겠습니까?')) return;

    try {
      const reviewId = Number(params.id);
      await deleteDormReviewApi(reviewId);
      alert('리뷰가 삭제되었습니다.');
      router.push('/dorm');
    } catch (error) {
      console.error('리뷰 삭제 실패:', error);
      alert('리뷰 삭제에 실패했습니다.');
    }
  };

  // 로딩 상태
  if (isLoading || !review) {
    return (
      <Wrapper>
        <Container>
          <LoadingText>로딩 중...</LoadingText>
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
          <Title>리뷰 상세 조회</Title>
          <Spacer />
        </Header>

        <ReviewCard>
          <ProfileSection>
            <ProfileImage
              src={'/profile_white.svg'}
              alt='프로필 이미지'
              width={50}
              height={50}
            />
            <ProfileInfo>
              <TopRow>
                <NameSection>
                  <Name>
                    {review.anonym ? '익명' : review.nickname || '사용자'}
                  </Name>
                </NameSection>
                <TagRow>
                  <Tag>{review.buildName}</Tag>
                  <Tag>{review.buildNum}</Tag>
                  <Tag>{review.roomPeople}인실</Tag>
                </TagRow>
              </TopRow>
              <RatingRow>
                <StarDisplay
                  stars={review.finalRate}
                  score={review.finalRate}
                  size='medium'
                />
                <DateText>
                  {review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString('ko-KR')
                    : ''}
                </DateText>
              </RatingRow>
            </ProfileInfo>
            <DeleteButton onClick={handleDeleteReview}>
              삭제
            </DeleteButton>
          </ProfileSection>

          {review.imageUrls && review.imageUrls.length > 0 && (
            <ImageSection>
              {review.imageUrls.map((url, index) => (
                <ReviewImage
                  key={index}
                  src={url}
                  alt={`리뷰 이미지 ${index + 1}`}
                  onClick={() => setSelectedImage(url)}
                />
              ))}
            </ImageSection>
          )}

          <EvaluationList
            evaluations={{
              방음: review.soundRate,
              시설: review.facilityRate,
              접근성: review.accessRate,
              벌레: review.bugRate,
            }}
            size='medium'
          />

          <ContentSection>
            <ContentTitle>후기</ContentTitle>
            <ContentBox>
              <ContentText>{review.review}</ContentText>
            </ContentBox>
          </ContentSection>
        </ReviewCard>

        <CommentsSection>
          <CommentsHeader>댓글 {comments.length}개</CommentsHeader>

          {Array.isArray(comments) &&
            comments.map((comment) => (
              <CommentItem key={comment.commentId}>
                <CommentTopRow>
                  <CommentLeft>
                    <CommentAuthor>{comment.nickname}</CommentAuthor>
                    <CommentDate>
                      {new Date(comment.createdAt).toLocaleString('ko-KR')}
                    </CommentDate>
                  </CommentLeft>
                  <CommentActions>
                    <ActionButton
                      onClick={() => handleDeleteComment(comment.commentId)}
                    >
                      삭제
                    </ActionButton>
                  </CommentActions>
                </CommentTopRow>
                <CommentText>{comment.content}</CommentText>
              </CommentItem>
            ))}

          {comments.length === 0 && (
            <EmptyComment>첫 댓글을 남겨보세요!</EmptyComment>
          )}
        </CommentsSection>

        <CommentInputSection>
          <InputRow>
            <CheckboxWrapper>
              <Checkbox
                type='checkbox'
                id='anonymous'
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <CheckboxLabel htmlFor='anonymous'>
                <CheckIcon $checked={isAnonymous}>
                  {isAnonymous && '✓'}
                </CheckIcon>
                익명
              </CheckboxLabel>
            </CheckboxWrapper>
            <CommentInput
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder='댓글 작성'
              disabled={isSubmittingComment}
            />
            <SubmitButton
              onClick={handleSubmitComment}
              disabled={isSubmittingComment || !commentText.trim()}
            >
              <Image src='/send.svg' alt='전송' width={17} height={17} />
            </SubmitButton>
          </InputRow>
        </CommentInputSection>
      </Container>
      
      {selectedImage && (
        <ImageModal onClick={() => setSelectedImage(null)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalImage src={selectedImage} alt="확대된 이미지" />
            <CloseButton onClick={() => setSelectedImage(null)}>×</CloseButton>
          </ModalContent>
        </ImageModal>
      )}
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
  padding: 0;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 60px 24px 20px;
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

const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 22px;
  border-radius: 11px;
  border: 1px solid #e8e8e8;
  background: #fafafa;
  font-size: 10px;
  font-weight: 400;
  color: #888;
  cursor: pointer;
  transition: all 0.2s;
  margin-left: auto;
  align-self: flex-start;

  &:hover {
    background: #f5f5f5;
    border-color: #ddd;
    color: #666;
  }

  &:active {
    transform: scale(0.96);
  }
`;

const LoadingText = styled.div`
  text-align: center;
  padding: 60px 0;
  font-size: 16px;
  color: #666;
`;

const EmptyComment = styled.div`
  text-align: center;
  padding: 40px 0;
  font-size: 14px;
  color: #999;
`;

const ReviewCard = styled.div`
  background: #fff;
  border-radius: 0;
  padding: 20px 24px;
  margin-bottom: 16px;
  box-shadow: none;
`;

const ProfileSection = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 14px;
  align-items: flex-start;
`;

const ProfileImage = styled(Image)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;

const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const NameSection = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Name = styled.div`
  font-size: 14px;
  font-weight: 700;
  color: #000;
`;

const TagRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  align-items: center;
`;

const Tag = styled.span`
  display: inline-flex;
  padding: 3px 8px;
  border-radius: 10px;
  background: #f5f5f5;
  border: none;
  color: #666;
  font-size: 8px;
  font-weight: 400;
`;

const RatingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const DateText = styled.span`
  font-size: 10px;
  color: #aaa;
`;

const ImageSection = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 18px;
  overflow-x: auto;
  padding-bottom: 4px;
  
  &::-webkit-scrollbar {
    display: none;
  }
  
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const ReviewImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 16px;
  object-fit: cover;
  flex-shrink: 0;
  cursor: pointer;
  transition: transform 0.2s;
  
  &:hover {
    transform: scale(1.02);
  }
`;

const ImageModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  cursor: pointer;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  cursor: default;
`;

const ModalImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: white;
  border: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: #f0f0f0;
  }
`;

const ContentSection = styled.div`
  margin-top: 0;
  padding-top: 0;
  border-top: none;
`;

const ContentTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #000;
  margin: 0 0 10px 0;
`;

const ContentBox = styled.div`
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  background: #fafafa;
`;

const ContentText = styled.p`
  font-size: 14px;
  line-height: 1.7;
  color: #333;
  margin: 0;
  white-space: pre-wrap;
`;

const CommentsSection = styled.div`
  margin-bottom: 16px;
  padding: 0 24px;
`;

const CommentsHeader = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #000;
  margin: 0 0 14px 0;
`;

const CommentItem = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border: 1px solid #e5e5e5;
`;

const CommentTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const CommentLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CommentAuthor = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #000;
`;

const CommentDate = styled.span`
  font-size: 10px;
  color: #999;
`;

const CommentText = styled.p`
  font-size: 13px;
  line-height: 1.5;
  color: #333;
  margin: 0;
`;

const CommentActions = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  font-size: 11px;
  color: #b0b0b0;
  cursor: pointer;
  padding: 0;

  &:hover {
    color: #666;
  }
`;

const CommentInputSection = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 12px 24px 20px;
  box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.06);
  max-width: 360px;
  margin: 0 auto;
`;

const InputRow = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 22px;
  padding: 0 6px 0 12px;
  height: 44px;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

const Checkbox = styled.input`
  display: none;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
`;

const CheckIcon = styled.div<{ $checked: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1.5px solid
    ${({ $checked, theme }) => ($checked ? theme.colors.primary : '#d0d0d0')};
  background: ${({ $checked, theme }) =>
    $checked ? theme.colors.primary : '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  transition: all 0.2s;
`;

const CommentInput = styled.input`
  flex: 1;
  height: 100%;
  padding: 0 8px;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #000;

  &::placeholder {
    color: #b6b6b6;
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    color: #999;
    background: #f5f5f5;
  }
`;

const SubmitButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    transform: scale(1.05);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  img {
    filter: brightness(0) invert(1);
  }
`;
