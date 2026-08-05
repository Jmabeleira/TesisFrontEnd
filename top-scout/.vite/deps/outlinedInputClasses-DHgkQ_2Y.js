import { $ as generateUtilityClass, Q as generateUtilityClasses } from "./styled-Bnwhpcsu.js";
//#region node_modules/@mui/material/InputBase/inputBaseClasses.mjs
function getInputBaseUtilityClass(slot) {
	return generateUtilityClass("MuiInputBase", slot);
}
var inputBaseClasses = generateUtilityClasses("MuiInputBase", [
	"root",
	"formControl",
	"focused",
	"disabled",
	"adornedStart",
	"adornedEnd",
	"error",
	"sizeSmall",
	"multiline",
	"colorSecondary",
	"fullWidth",
	"hiddenLabel",
	"readOnly",
	"input",
	"inputTypeSearch"
]);
//#endregion
//#region node_modules/@mui/material/FilledInput/filledInputClasses.mjs
function getFilledInputUtilityClass(slot) {
	return generateUtilityClass("MuiFilledInput", slot);
}
var filledInputClasses = {
	...inputBaseClasses,
	...generateUtilityClasses("MuiFilledInput", [
		"root",
		"underline",
		"input",
		"adornedStart",
		"adornedEnd",
		"sizeSmall",
		"multiline",
		"hiddenLabel"
	])
};
//#endregion
//#region node_modules/@mui/material/FormHelperText/formHelperTextClasses.mjs
function getFormHelperTextUtilityClasses(slot) {
	return generateUtilityClass("MuiFormHelperText", slot);
}
var formHelperTextClasses = generateUtilityClasses("MuiFormHelperText", [
	"root",
	"error",
	"disabled",
	"sizeSmall",
	"sizeMedium",
	"contained",
	"focused",
	"filled",
	"required"
]);
//#endregion
//#region node_modules/@mui/material/FormLabel/formLabelClasses.mjs
function getFormLabelUtilityClasses(slot) {
	return generateUtilityClass("MuiFormLabel", slot);
}
var formLabelClasses = generateUtilityClasses("MuiFormLabel", [
	"root",
	"colorSecondary",
	"focused",
	"disabled",
	"error",
	"filled",
	"required",
	"asterisk"
]);
//#endregion
//#region node_modules/@mui/material/Input/inputClasses.mjs
function getInputUtilityClass(slot) {
	return generateUtilityClass("MuiInput", slot);
}
var inputClasses = {
	...inputBaseClasses,
	...generateUtilityClasses("MuiInput", [
		"root",
		"underline",
		"input"
	])
};
//#endregion
//#region node_modules/@mui/material/NativeSelect/nativeSelectClasses.mjs
function getNativeSelectUtilityClasses(slot) {
	return generateUtilityClass("MuiNativeSelect", slot);
}
var nativeSelectClasses = generateUtilityClasses("MuiNativeSelect", [
	"root",
	"select",
	"multiple",
	"filled",
	"outlined",
	"standard",
	"disabled",
	"icon",
	"iconOpen",
	"iconFilled",
	"iconOutlined",
	"iconStandard",
	"nativeInput",
	"error"
]);
//#endregion
//#region node_modules/@mui/material/OutlinedInput/outlinedInputClasses.mjs
function getOutlinedInputUtilityClass(slot) {
	return generateUtilityClass("MuiOutlinedInput", slot);
}
var outlinedInputClasses = {
	...inputBaseClasses,
	...generateUtilityClasses("MuiOutlinedInput", [
		"root",
		"notchedOutline",
		"input"
	])
};
//#endregion
export { getInputUtilityClass as a, getFormLabelUtilityClasses as c, filledInputClasses as d, getFilledInputUtilityClass as f, nativeSelectClasses as i, formHelperTextClasses as l, inputBaseClasses as m, outlinedInputClasses as n, inputClasses as o, getInputBaseUtilityClass as p, getNativeSelectUtilityClasses as r, formLabelClasses as s, getOutlinedInputUtilityClass as t, getFormHelperTextUtilityClasses as u };

//# sourceMappingURL=outlinedInputClasses-DHgkQ_2Y.js.map