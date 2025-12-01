import axiosInstance from './axiosInstance';

// 자취/하숙 상세 조회
export const getHouseDetailApi = async (house_id: string | number) => {
  const res = await axiosInstance.get(`/house/${house_id}`);
  return res.data;
};

// 자취/하숙 리뷰 등록
export const createHouseReviewApi = async (
  house_id: string | number,
  data: {
    facilityRate: 'DIRTY' | 'NORMAL' | 'CLEAN';
    accessRate: 'BAD' | 'NORMAL' | 'GOOD';
    soundRate: 'NONE' | 'SOMETIMES' | 'OFTEN';
    bugRate: 'NONE' | 'SOMETIMES' | 'OFTEN';
    finalRate: number;
    review: string;
    anonym: boolean;
    imageUrls?: string[];
  }
) => {
  const res = await axiosInstance.post(`/house/${house_id}/review`, data);
  return res.data;
};

// 자취/하숙 리뷰 목록 조회
export const getHouseReviewsApi = async (house_id: string | number) => {
  const res = await axiosInstance.get(`/house/${house_id}/review`);
  return res.data;
};

// 자취/하숙 리뷰 상세 조회
export const getHouseReviewDetailApi = async (
  house_id: string | number,
  review_id: string | number
) => {
  const res = await axiosInstance.get(`/house/${house_id}/review/${review_id}`);
  return res.data;
};

// 자취/하숙 리뷰 삭제
export const deleteHouseReviewApi = async (
  house_id: number,
  review_id: number
) => {
  const res = await axiosInstance.delete(
    `/house/${house_id}/review/${review_id}`
  );
  return res.status;
};

// 리뷰 이미지 업로드
export const uploadReviewImageApi = async (imageFile: File) => {
  const formData = new FormData();
  formData.append('images', imageFile);

  const res = await axiosInstance.post('/review/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data; // imageUrl 반환
};
