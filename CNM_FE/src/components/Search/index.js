import React, { useEffect, useRef, useState } from "react";
import {
  styled,
  IconButton,
  Box,
  AppBar,
  Toolbar,
  InputBase,
  alpha,
} from "@material-ui/core";

import { Search, GroupAdd, PersonAdd } from "@material-ui/icons";
import useDebounce from "../../hooks/useDebounce";
import { useDispatch } from "react-redux";
import {
  showAddFriendModal,
  showAddGroupModal,
} from "../../redux/actions/modal";
const SearchStyled = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
  display: "flex",
  alignItems: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

function SearchComponent() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedValue = useDebounce(searchValue, 500);
  const inputRef = useRef();
  const dispatch = useDispatch();
  const handleShowAddFriendModal = () => {
    dispatch(showAddFriendModal());
  };

  const handleShowAddGroupModal = () => {
    dispatch(showAddGroupModal());
  };

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult([]);
      return;
    }

    const fetchApi = async () => {
      setLoading(true);

      const result = null;
      //  await searchService.search(debouncedValue);
      setSearchResult(result);

      setLoading(false);
    };

    fetchApi();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const handleClear = () => {
    setSearchValue("");
    setSearchResult([]);
    inputRef.current.focus();
  };

  const handleHideResult = () => {
    setShowResult(false);
  };

  const handleChange = (e) => {
    const searchValue = e.target.value;
    if (searchValue.startsWith(" ")) {
      return;
    }
    setSearchValue(searchValue);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{
          backgroundColor: "#0978f5",
          boxShadow: "none",
          borderLeft: "1px solid #E1E1E1",
          height: "60px",
        }}
      >
        <Toolbar>
          <SearchStyled style={{ marginLeft: 0 }}>
            <Search style={{ margin: "0 5%" }} />
            <StyledInputBase
              ref={inputRef}
              placeholder="Tìm kiếm"
              inputProps={{ "aria-label": "search" }}
              onChange={handleChange}
              value={searchValue}
              onFocus={() => setShowResult(true)}
            />
          </SearchStyled>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton onClick={handleShowAddFriendModal}>
              <PersonAdd style={{ color: "white" }} />
            </IconButton>
            <IconButton onClick={handleShowAddGroupModal}>
              <GroupAdd style={{ fontSize: "1.9rem", color: "white" }} />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default SearchComponent;
