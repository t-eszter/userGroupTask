export type ListUsersParams = {
  // Start offset for iteration over all users
  start?: number;
  // Filter the results by name
  name?: string;
  // Max number of elements to return
  count?: number;
  // Filter the results by user groups
  groups?: string[];
};

export type ListUserGroupsParams = {
  start?: number;
  name?: string;
  count?: number;
  groups?: string[];
  // Only return user groups that contain the given user
  containedUser?: string;
  // Only return user groups that contain the given user group
  containedUserGroup?: string;
  // Only return user groups that don't contain the given user
  notContainedUser?: string;
  // Only return user groups that don't contain the given user group
  notContainedUserGroup?: string;
};

export type Entity = {
  id: string;
  name: string;
};
