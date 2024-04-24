export const USER_GENDER_MALE = 'male';
export const USER_GENDER_FEMALE = 'female';
export const USER_GENDER_ALL = 'all';
export const USER_GENDER_NONE = 'none';

export const USER_OPPOSITE_GENDER_MAP = {
  [USER_GENDER_MALE]: USER_GENDER_FEMALE,
  [USER_GENDER_FEMALE]: USER_GENDER_MALE,
};

export const USER_EXCLUDED_FIELDS = ['password'];
