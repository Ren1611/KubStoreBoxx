import React from "react";
import { useTranslation } from "../hooks/useTranslation";
import { FormControl, Select, MenuItem, InputLabel, Box } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

const LanguageSwitcher = () => {
  const { currentLanguage, changeLanguage } = useTranslation();

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "ky", name: "Кыргызча", flag: "🇰🇬" },
  ];

  const handleChange = async (event) => {
    const lng = event.target.value;
    await changeLanguage(lng);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="language-select-label">
          <LanguageIcon sx={{ mr: 1, fontSize: 20 }} />
          Language
        </InputLabel>
        <Select
          labelId="language-select-label"
          id="language-select"
          value={currentLanguage}
          label="Language"
          onChange={handleChange}
          sx={{
            "& .MuiSelect-select": {
              display: "flex",
              alignItems: "center",
              gap: 1,
            },
          }}
        >
          {languages.map((lang) => (
            <MenuItem key={lang.code} value={lang.code}>
              <span style={{ fontSize: "1.2em" }}>{lang.flag}</span>
              {lang.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSwitcher;
