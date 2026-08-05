import { i as __toESM, t as require_react } from "./react-CZunmVaX.js";
//#region node_modules/@mui/utils/isMuiElement/isMuiElement.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function isMuiElement(element, muiNames) {
	return /*#__PURE__*/ import_react.isValidElement(element) && muiNames.indexOf(element.type.muiName ?? element.type?._payload?.value?.muiName) !== -1;
}
//#endregion
//#region node_modules/@mui/utils/requirePropFactory/requirePropFactory.mjs
function requirePropFactory(componentNameInError, Component) {
	const prevPropTypes = Component ? { ...Component.propTypes } : null;
	const requireProp = (requiredProp) => (props, propName, componentName, location, propFullName, ...args) => {
		const propFullNameSafe = propFullName || propName;
		const defaultTypeChecker = prevPropTypes?.[propFullNameSafe];
		if (defaultTypeChecker) {
			const typeCheckerResult = defaultTypeChecker(props, propName, componentName, location, propFullName, ...args);
			if (typeCheckerResult) return typeCheckerResult;
		}
		if (typeof props[propName] !== "undefined" && !props[requiredProp]) return /* @__PURE__ */ new Error(`The prop \`${propFullNameSafe}\` of \`${componentNameInError}\` can only be used together with the \`${requiredProp}\` prop.`);
		return null;
	};
	return requireProp;
}
//#endregion
//#region node_modules/@mui/material/utils/requirePropFactory.mjs
var requirePropFactory_default = requirePropFactory;
//#endregion
export { isMuiElement as n, requirePropFactory_default as t };

//# sourceMappingURL=requirePropFactory-DqOAYaqd.js.map