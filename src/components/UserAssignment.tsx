import React, { useState, useEffect } from "react";
import {
  Link,
  Typography,
  TextField,
  Button,
  IconButton,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  InputAdornment,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { storageInit, storageKey } from "../queries/constants";
import { Entity } from "../queries/types";
import { useListUsers } from "../queries/useListUsers";
import { useListUserGroups } from "../queries/useListUserGroups";
import Popover from "@mui/material/Popover";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import TablePagination from "@mui/material/TablePagination";
import { ColorModeContext } from "../style/ColorModeContext";

export default function UserAssignment() {
  type Entity = {
    id: string;
    name: string;
  };

  const colorMode = React.useContext(ColorModeContext);

  if (!colorMode) {
    return null;
  }

  const [userAssignments, setUserAssignments] = useState(storageInit);

  const { data: users, isLoading: usersLoading } = useListUsers();
  const { data: userGroups, isLoading: userGroupsLoading } =
    useListUserGroups();

  const [filter, setFilter] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<Entity[]>([]);
  const [filteredGroupId, setFilteredGroupId] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedGroupId, setSelectedGroupId] = useState("");

  // All/None selection for user groups
  const [selectedUserId, setSelectedUserId] = useState("");
  const [userAnchorEl, setUserAnchorEl] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const storedAssignments = localStorage.getItem(storageKey);
    if (storedAssignments) {
      setUserAssignments(JSON.parse(storedAssignments));
    }
  }, []);

  // Filter users from search field and from columns
  useEffect(() => {
    let currentUsers = users || [];

    if (filter) {
      currentUsers = currentUsers.filter((user) =>
        user.name.toLowerCase().includes(filter.toLowerCase())
      );
    }

    if (filteredGroupId) {
      currentUsers = currentUsers.filter((user) =>
        userAssignments[user.id]?.includes(filteredGroupId)
      );
    }

    setFilteredUsers(currentUsers);
  }, [users, filter, filteredGroupId, userAssignments]);

  //Save button function
  const handleSaveChanges = () => {
    console.log("Changes saved!");
  };

  //Discard button function
  const handleCancel = () => {
    console.log("Changes canceled!");
  };

  //Column popover open
  const handlePopoverOpen = (event: any, userGroupId: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroupId(userGroupId);
  };

  //Column popover close
  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  //User popover open
  const handleUserPopoverOpen = (event: any, userId: string) => {
    setUserAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  //User popover close
  const handleUserPopoverClose = () => {
    setUserAnchorEl(null);
  };

  //Add/remove user from User Group
  const handleUserAssignment = (userId: string, userGroupId: string) => {
    const updatedAssignments = { ...userAssignments };
    if (updatedAssignments[userId]?.includes(userGroupId)) {
      updatedAssignments[userId] = updatedAssignments[userId].filter(
        (groupId) => groupId !== userGroupId
      );
    } else {
      updatedAssignments[userId] = [
        ...(updatedAssignments[userId] || []),
        userGroupId,
      ];
    }
    setUserAssignments(updatedAssignments);
    localStorage.setItem(storageKey, JSON.stringify(updatedAssignments));
  };

  //check if users is added to all groups
  const areAllGroupsSelectedForUser = (userId: string) => {
    return userGroups?.every((userGroup) =>
      userAssignments[userId]?.includes(userGroup.id)
    );
  };

  //check if all users are added to a group
  const areAllUsersInGroup = (userGroupId: string) => {
    return users?.every((user) =>
      userAssignments[user.id]?.includes(userGroupId)
    );
  };

  //Select all groups for User functon
  const handleSelectAllForUser = (userId: string) => {
    const updatedAssignments = { ...userAssignments };
    if (areAllGroupsSelectedForUser(userId)) {
      userGroups?.forEach((userGroup) => {
        updatedAssignments[userId] =
          updatedAssignments[userId]?.filter(
            (groupId) => groupId !== userGroup.id
          ) || [];
      });
    } else {
      userGroups?.forEach((userGroup) => {
        if (!updatedAssignments[userId]?.includes(userGroup.id)) {
          updatedAssignments[userId] = [
            ...(updatedAssignments[userId] || []),
            userGroup.id,
          ];
        }
      });
    }
    setUserAssignments(updatedAssignments);
    localStorage.setItem(storageKey, JSON.stringify(updatedAssignments));
  };

  //select all users for a group function
  const handleSelectAllForGroup = (userGroupId: string) => {
    const updatedAssignments = { ...userAssignments };
    if (areAllUsersInGroup(userGroupId)) {
      users?.forEach((user) => {
        updatedAssignments[user.id] =
          updatedAssignments[user.id]?.filter(
            (groupId) => groupId !== userGroupId
          ) || [];
      });
    } else {
      users?.forEach((user) => {
        if (!updatedAssignments[user.id]?.includes(userGroupId)) {
          updatedAssignments[user.id] = [
            ...(updatedAssignments[user.id] || []),
            userGroupId,
          ];
        }
      });
    }
    setUserAssignments(updatedAssignments);
    localStorage.setItem(storageKey, JSON.stringify(updatedAssignments));
  };

  if (usersLoading || userGroupsLoading) return "Loading...";

  return (
    <div>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <TextField
          label="User search"
          placeholder="First Name Last Name"
          variant="outlined"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          size="small"
          className="searchInput"
          // clear filter
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="clear filter"
                  edge="end"
                  onClick={() => setFilter("")}
                  size="small"
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <div>
          <Link
            sx={{ pr: 4 }}
            color="secondary"
            onClick={handleCancel}
            underline="none"
          >
            Reset
          </Link>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>

      <TableContainer
        sx={{
          border: 1,
          borderColor: "#E0E0E0",
          borderRadius: "10px",
          maxWidth: "100%",
          overflowX: "auto",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  fontWeight: "bold",
                  position: "sticky",
                  left: 0,
                  zIndex: 1,
                  // backgroundColor: "#fff",
                  minWidth: "200px",
                  // boxShadow:
                  //   "2px 0 3px rgba(0,0,0,0.1), 2px 0 2px rgba(0,0,0,0.08)",
                }}
              >
                User Name
              </TableCell>
              {userGroups?.map((userGroup) => (
                <TableCell
                  key={userGroup.id}
                  align="center"
                  style={{
                    fontWeight: "bold",
                    backgroundColor:
                      filteredGroupId === userGroup.id ? "#EEF9FF" : "inherit", //filtered column background color
                    minWidth: "120px",
                    padding: "0 !important",
                  }}
                >
                  {userGroup.name}
                  <IconButton
                    aria-label="options"
                    size="small"
                    onClick={(e) => handlePopoverOpen(e, userGroup.id)}
                    style={{ display: "inline-block" }}
                  >
                    <ArrowDropDownIcon />
                  </IconButton>
                  <Popover
                    open={selectedGroupId === userGroup.id && Boolean(anchorEl)}
                    anchorEl={anchorEl}
                    onClose={handlePopoverClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "center",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        padding: "1rem",
                      }}
                    >
                      {filteredGroupId === userGroup.id ? (
                        <Link
                          href="#"
                          onClick={() => {
                            setFilteredGroupId("");
                            handlePopoverClose();
                          }}
                          underline="none"
                        >
                          Filter Off
                        </Link>
                      ) : (
                        <Link
                          href="#"
                          onClick={() => {
                            setFilteredGroupId(userGroup.id);
                            handlePopoverClose();
                          }}
                          underline="none"
                        >
                          Filter
                        </Link>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "left",
                        padding: "0 1rem 1rem 1rem",
                      }}
                    >
                      <Link
                        href="#"
                        onClick={() => {
                          handleSelectAllForGroup(userGroup.id);
                          handlePopoverClose();
                        }}
                        underline="none"
                      >
                        {areAllUsersInGroup(userGroup.id)
                          ? "Deselect All"
                          : "Select All"}
                      </Link>
                    </div>
                  </Popover>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredUsers
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((user: any, index: any, array: any) => (
                <TableRow key={user.id}>
                  <TableCell
                    style={{
                      ...(index === array.length - 1
                        ? { borderBottom: "none" }
                        : {}),
                      width: "240px !important",
                      position: "sticky",
                      left: 0,
                      zIndex: 1,
                      // boxShadow: "-13px 0px 25px -18px rgba(0,0,0,0.43) inset",
                      background: "#FBFBFB",
                      // borderRight: "1px solid #E0E0E0",
                    }}
                  >
                    <IconButton
                      aria-label="options"
                      size="small"
                      onClick={(e) => handleUserPopoverOpen(e, user.id)}
                    >
                      <ArrowDropDownIcon />
                    </IconButton>
                    {user.name}
                    <Popover
                      open={selectedUserId === user.id && Boolean(userAnchorEl)}
                      anchorEl={userAnchorEl}
                      onClose={handleUserPopoverClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <div
                        style={{
                          padding: "1rem",
                        }}
                      >
                        <Link
                          href="#"
                          onClick={() => {
                            handleSelectAllForUser(user.id);
                            handleUserPopoverClose();
                          }}
                          underline="none"
                        >
                          {areAllGroupsSelectedForUser(user.id)
                            ? "Deselect all"
                            : "Select all"}
                        </Link>
                      </div>
                    </Popover>
                  </TableCell>

                  {userGroups?.map((userGroup, groupIndex) => (
                    <TableCell
                      key={userGroup.id}
                      align="center"
                      style={{
                        backgroundColor:
                          filteredGroupId === userGroup.id
                            ? "#EEF9FF"
                            : "inherit", //filtered column background color
                        borderBottom: index === array.length - 1 ? "none" : "",
                        width: "fit-content",
                        // background:
                        //   groupIndex === 0
                        //     ? "linear-gradient(90deg, rgba(205,205,205,1) 0%, rgba(255,255,255,1) 11%, rgba(255,255,255,1) 100%)"
                        //     : "#fff",
                      }}
                    >
                      <Switch
                        checked={
                          userAssignments[user.id]?.includes(userGroup.id) ||
                          false
                        }
                        onChange={() =>
                          handleUserAssignment(user.id, userGroup.id)
                        }
                        color="primary"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredUsers.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="Users per page"
      />
    </div>
  );
}
