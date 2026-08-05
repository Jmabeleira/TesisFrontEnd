import { i as __toESM, t as require_react } from "./react-CZunmVaX.js";
import { $ as generateUtilityClass, Et as require_prop_types, J as useThemeProps, Q as generateUtilityClasses, Tt as clsx, Z as styled, it as createTheme, nt as useTheme, st as require_jsx_runtime, t as styled$1, wt as composeClasses } from "./styled-Bnwhpcsu.js";
import { n as isMuiElement, t as requirePropFactory_default } from "./requirePropFactory-DqOAYaqd.js";
import { t as useTheme$1 } from "./useTheme-Cjr1qCSE.js";
import { t as useDefaultProps } from "./DefaultPropsProvider-BQcRtwYO.js";
//#region node_modules/@mui/system/Grid/traverseBreakpoints.mjs
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_prop_types = /* @__PURE__ */ __toESM(require_prop_types(), 1);
var filterBreakpointKeys = (breakpointsKeys, responsiveKeys) => breakpointsKeys.filter((key) => responsiveKeys.includes(key));
var traverseBreakpoints = (breakpoints, responsive, iterator) => {
	const smallestBreakpoint = breakpoints.keys[0];
	if (Array.isArray(responsive)) responsive.forEach((breakpointValue, index) => {
		iterator((responsiveStyles, style) => {
			if (index <= breakpoints.keys.length - 1) if (index === 0) Object.assign(responsiveStyles, style);
			else responsiveStyles[breakpoints.up(breakpoints.keys[index])] = style;
		}, breakpointValue);
	});
	else if (responsive && typeof responsive === "object") (Object.keys(responsive).length > breakpoints.keys.length ? breakpoints.keys : filterBreakpointKeys(breakpoints.keys, Object.keys(responsive))).forEach((key) => {
		if (breakpoints.keys.includes(key)) {
			const breakpointValue = responsive[key];
			if (breakpointValue !== void 0) iterator((responsiveStyles, style) => {
				if (smallestBreakpoint === key) Object.assign(responsiveStyles, style);
				else responsiveStyles[breakpoints.up(key)] = style;
			}, breakpointValue);
		}
	});
	else if (typeof responsive === "number" || typeof responsive === "string") iterator((responsiveStyles, style) => {
		Object.assign(responsiveStyles, style);
	}, responsive);
};
//#endregion
//#region node_modules/@mui/system/Grid/gridGenerator.mjs
function getSelfSpacingVar(axis) {
	return `--Grid-${axis}Spacing`;
}
function getParentSpacingVar(axis) {
	return `--Grid-parent-${axis}Spacing`;
}
var selfColumnsVar = "--Grid-columns";
var parentColumnsVar = "--Grid-parent-columns";
var generateGridSizeStyles = ({ theme, ownerState }) => {
	const styles = {};
	traverseBreakpoints(theme.breakpoints, ownerState.size, (appendStyle, value) => {
		let style = {};
		if (value === "grow") style = {
			flexBasis: 0,
			flexGrow: 1,
			maxWidth: "100%"
		};
		if (value === "auto") style = {
			flexBasis: "auto",
			flexGrow: 0,
			flexShrink: 0,
			maxWidth: "none",
			width: "auto"
		};
		if (typeof value === "number") style = {
			flexGrow: 0,
			flexBasis: "auto",
			width: `calc(100% * ${value} / var(${parentColumnsVar}) - (var(${parentColumnsVar}) - ${value}) * (var(${getParentSpacingVar("column")}) / var(${parentColumnsVar})))`
		};
		appendStyle(styles, style);
	});
	return styles;
};
var generateGridOffsetStyles = ({ theme, ownerState }) => {
	const styles = {};
	traverseBreakpoints(theme.breakpoints, ownerState.offset, (appendStyle, value) => {
		let style = {};
		if (value === "auto") style = { marginLeft: "auto" };
		if (typeof value === "number") style = { marginLeft: value === 0 ? "0px" : `calc(100% * ${value} / var(${parentColumnsVar}) + var(${getParentSpacingVar("column")}) * ${value} / var(${parentColumnsVar}))` };
		appendStyle(styles, style);
	});
	return styles;
};
var generateGridColumnsStyles = ({ theme, ownerState }) => {
	if (!ownerState.container) return {};
	const styles = { [selfColumnsVar]: 12 };
	traverseBreakpoints(theme.breakpoints, ownerState.columns, (appendStyle, value) => {
		const columns = value ?? 12;
		appendStyle(styles, {
			[selfColumnsVar]: columns,
			"> *": { [parentColumnsVar]: columns }
		});
	});
	return styles;
};
var generateGridRowSpacingStyles = ({ theme, ownerState }) => {
	if (!ownerState.container) return {};
	const styles = {};
	traverseBreakpoints(theme.breakpoints, ownerState.rowSpacing, (appendStyle, value) => {
		const spacing = typeof value === "string" ? value : theme.spacing?.(value);
		appendStyle(styles, {
			[getSelfSpacingVar("row")]: spacing,
			"> *": { [getParentSpacingVar("row")]: spacing }
		});
	});
	return styles;
};
var generateGridColumnSpacingStyles = ({ theme, ownerState }) => {
	if (!ownerState.container) return {};
	const styles = {};
	traverseBreakpoints(theme.breakpoints, ownerState.columnSpacing, (appendStyle, value) => {
		const spacing = typeof value === "string" ? value : theme.spacing?.(value);
		appendStyle(styles, {
			[getSelfSpacingVar("column")]: spacing,
			"> *": { [getParentSpacingVar("column")]: spacing }
		});
	});
	return styles;
};
var generateGridDirectionStyles = ({ theme, ownerState }) => {
	if (!ownerState.container) return {};
	const styles = {};
	traverseBreakpoints(theme.breakpoints, ownerState.direction, (appendStyle, value) => {
		appendStyle(styles, { flexDirection: value });
	});
	return styles;
};
var generateGridStyles = ({ ownerState }) => {
	return {
		minWidth: 0,
		boxSizing: "border-box",
		...ownerState.container && {
			display: "flex",
			flexWrap: "wrap",
			...ownerState.wrap && ownerState.wrap !== "wrap" && { flexWrap: ownerState.wrap },
			gap: `var(${getSelfSpacingVar("row")}) var(${getSelfSpacingVar("column")})`
		}
	};
};
var generateSizeClassNames = (size) => {
	const classNames = [];
	Object.entries(size).forEach(([key, value]) => {
		if (value !== false && value !== void 0) classNames.push(`grid-${key}-${String(value)}`);
	});
	return classNames;
};
var generateSpacingClassNames = (spacing, smallestBreakpoint = "xs") => {
	function isValidSpacing(val) {
		if (val === void 0) return false;
		return typeof val === "string" && !Number.isNaN(Number(val)) || typeof val === "number" && val > 0;
	}
	if (isValidSpacing(spacing)) return [`spacing-${smallestBreakpoint}-${String(spacing)}`];
	if (typeof spacing === "object" && !Array.isArray(spacing)) {
		const classNames = [];
		Object.entries(spacing).forEach(([key, value]) => {
			if (isValidSpacing(value)) classNames.push(`spacing-${key}-${String(value)}`);
		});
		return classNames;
	}
	return [];
};
var generateDirectionClasses = (direction) => {
	if (direction === void 0) return [];
	if (typeof direction === "object") return Object.entries(direction).map(([key, value]) => `direction-${key}-${value}`);
	return [`direction-xs-${String(direction)}`];
};
//#endregion
//#region node_modules/@mui/system/Grid/createGrid.mjs
var import_jsx_runtime = require_jsx_runtime();
var defaultTheme = createTheme();
var defaultCreateStyledComponent = styled("div", {
	name: "MuiGrid",
	slot: "Root"
});
function useThemePropsDefault(props) {
	return useThemeProps({
		props,
		name: "MuiGrid",
		defaultTheme
	});
}
function createGrid(options = {}) {
	const { createStyledComponent = defaultCreateStyledComponent, useThemeProps = useThemePropsDefault, useTheme: useTheme$2 = useTheme, componentName = "MuiGrid" } = options;
	const useUtilityClasses = (ownerState, theme) => {
		const { container, direction, spacing, wrap, size } = ownerState;
		return composeClasses({ root: [
			"root",
			container && "container",
			wrap !== "wrap" && `wrap-xs-${String(wrap)}`,
			...generateDirectionClasses(direction),
			...generateSizeClassNames(size),
			...container ? generateSpacingClassNames(spacing, theme.breakpoints.keys[0]) : []
		] }, (slot) => generateUtilityClass(componentName, slot), {});
	};
	function parseResponsiveProp(propValue, breakpoints, shouldUseValue = () => true) {
		const parsedProp = {};
		if (propValue === null) return parsedProp;
		if (Array.isArray(propValue)) propValue.forEach((value, index) => {
			if (value !== null && shouldUseValue(value) && breakpoints.keys[index]) parsedProp[breakpoints.keys[index]] = value;
		});
		else if (typeof propValue === "object") Object.keys(propValue).forEach((key) => {
			const value = propValue[key];
			if (value !== null && value !== void 0 && shouldUseValue(value)) parsedProp[key] = value;
		});
		else parsedProp[breakpoints.keys[0]] = propValue;
		return parsedProp;
	}
	const GridRoot = createStyledComponent(generateGridColumnsStyles, generateGridColumnSpacingStyles, generateGridRowSpacingStyles, generateGridSizeStyles, generateGridDirectionStyles, generateGridStyles, generateGridOffsetStyles);
	const Grid = /*#__PURE__*/ import_react.forwardRef(function Grid(inProps, ref) {
		const theme = useTheme$2();
		const props = useThemeProps(inProps);
		const { className, children, columns: columnsProp = 12, container = false, component = "div", direction = "row", wrap = "wrap", size: sizeProp = {}, offset: offsetProp = {}, spacing: spacingProp = 0, rowSpacing: rowSpacingProp = spacingProp, columnSpacing: columnSpacingProp = spacingProp, unstable_level: level = 0, ...other } = props;
		const size = parseResponsiveProp(sizeProp, theme.breakpoints, (val) => val !== false);
		const offset = parseResponsiveProp(offsetProp, theme.breakpoints);
		const columns = inProps.columns ?? (level ? void 0 : columnsProp);
		const spacing = inProps.spacing ?? (level ? void 0 : spacingProp);
		const rowSpacing = inProps.rowSpacing ?? inProps.spacing ?? (level ? void 0 : rowSpacingProp);
		const columnSpacing = inProps.columnSpacing ?? inProps.spacing ?? (level ? void 0 : columnSpacingProp);
		const ownerState = {
			...props,
			level,
			columns,
			container,
			direction,
			wrap,
			spacing,
			rowSpacing,
			columnSpacing,
			size,
			offset
		};
		return /*#__PURE__*/ (0, import_jsx_runtime.jsx)(GridRoot, {
			ref,
			as: component,
			ownerState,
			className: clsx(useUtilityClasses(ownerState, theme).root, className),
			...other,
			children: import_react.Children.map(children, (child) => {
				if (/*#__PURE__*/ import_react.isValidElement(child) && isMuiElement(child, ["Grid"]) && container && child.props.container) return /*#__PURE__*/ import_react.cloneElement(child, { unstable_level: child.props?.unstable_level ?? level + 1 });
				return child;
			})
		});
	});
	Grid.propTypes = {
		children: import_prop_types.default.node,
		className: import_prop_types.default.string,
		columns: import_prop_types.default.oneOfType([
			import_prop_types.default.arrayOf(import_prop_types.default.number),
			import_prop_types.default.number,
			import_prop_types.default.object
		]),
		columnSpacing: import_prop_types.default.oneOfType([
			import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string])),
			import_prop_types.default.number,
			import_prop_types.default.object,
			import_prop_types.default.string
		]),
		component: import_prop_types.default.elementType,
		container: import_prop_types.default.bool,
		direction: import_prop_types.default.oneOfType([
			import_prop_types.default.oneOf([
				"column-reverse",
				"column",
				"row-reverse",
				"row"
			]),
			import_prop_types.default.arrayOf(import_prop_types.default.oneOf([
				"column-reverse",
				"column",
				"row-reverse",
				"row"
			])),
			import_prop_types.default.object
		]),
		offset: import_prop_types.default.oneOfType([
			import_prop_types.default.string,
			import_prop_types.default.number,
			import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.number])),
			import_prop_types.default.object
		]),
		rowSpacing: import_prop_types.default.oneOfType([
			import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string])),
			import_prop_types.default.number,
			import_prop_types.default.object,
			import_prop_types.default.string
		]),
		size: import_prop_types.default.oneOfType([
			import_prop_types.default.string,
			import_prop_types.default.bool,
			import_prop_types.default.number,
			import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([
				import_prop_types.default.string,
				import_prop_types.default.bool,
				import_prop_types.default.number
			])),
			import_prop_types.default.object
		]),
		spacing: import_prop_types.default.oneOfType([
			import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string])),
			import_prop_types.default.number,
			import_prop_types.default.object,
			import_prop_types.default.string
		]),
		sx: import_prop_types.default.oneOfType([
			import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([
				import_prop_types.default.func,
				import_prop_types.default.object,
				import_prop_types.default.bool
			])),
			import_prop_types.default.func,
			import_prop_types.default.object
		]),
		wrap: import_prop_types.default.oneOf([
			"nowrap",
			"wrap-reverse",
			"wrap"
		])
	};
	Grid.muiName = "Grid";
	return Grid;
}
//#endregion
//#region node_modules/@mui/material/Grid/Grid.mjs
/**
*
* Demos:
*
* - [Grid](https://mui.com/material-ui/react-grid/)
*
* API:
*
* - [Grid API](https://mui.com/material-ui/api/grid/)
*/
var Grid = createGrid({
	createStyledComponent: styled$1("div", {
		name: "MuiGrid",
		slot: "Root",
		overridesResolver: (props, styles) => {
			const { ownerState } = props;
			return [styles.root, ownerState.container && styles.container];
		}
	}),
	componentName: "MuiGrid",
	useThemeProps: (inProps) => useDefaultProps({
		props: inProps,
		name: "MuiGrid"
	}),
	useTheme: useTheme$1
});
Grid.propTypes = {
	/**
	* The content of the component.
	*/
	children: import_prop_types.default.node,
	/**
	* The number of columns.
	* @default 12
	*/
	columns: import_prop_types.default.oneOfType([
		import_prop_types.default.arrayOf(import_prop_types.default.number),
		import_prop_types.default.number,
		import_prop_types.default.object
	]),
	/**
	* Defines the horizontal space between the type `item` components.
	* It overrides the value of the `spacing` prop.
	*/
	columnSpacing: import_prop_types.default.oneOfType([
		import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string])),
		import_prop_types.default.number,
		import_prop_types.default.object,
		import_prop_types.default.string
	]),
	/**
	* If `true`, the component will have the flex *container* behavior.
	* You should be wrapping *items* with a *container*.
	* @default false
	*/
	container: import_prop_types.default.bool,
	/**
	* Defines the `flex-direction` style property for the container.
	*
	* ⚠️ Only `row` and `row-reverse` are supported. `column` and `column-reverse` are not supported,
	* because the Grid component is designed to subdivide layouts into **columns**, not rows.
	*
	* For vertical layouts, use `Stack` instead.
	*
	* @default 'row'
	*/
	direction: import_prop_types.default.oneOfType([
		import_prop_types.default.oneOf(["row-reverse", "row"]),
		import_prop_types.default.arrayOf(import_prop_types.default.oneOf(["row-reverse", "row"])),
		import_prop_types.default.object
	]),
	/**
	* Defines the offset value for the type `item` components.
	*/
	offset: import_prop_types.default.oneOfType([
		import_prop_types.default.string,
		import_prop_types.default.number,
		import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.string, import_prop_types.default.number])),
		import_prop_types.default.object
	]),
	/**
	* Defines the vertical space between the type `item` components.
	* It overrides the value of the `spacing` prop.
	*/
	rowSpacing: import_prop_types.default.oneOfType([
		import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string])),
		import_prop_types.default.number,
		import_prop_types.default.object,
		import_prop_types.default.string
	]),
	/**
	* Defines the size of the the type `item` components.
	*/
	size: import_prop_types.default.oneOfType([
		import_prop_types.default.string,
		import_prop_types.default.bool,
		import_prop_types.default.number,
		import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([
			import_prop_types.default.string,
			import_prop_types.default.bool,
			import_prop_types.default.number
		])),
		import_prop_types.default.object
	]),
	/**
	* Defines the space between the type `item` components.
	* It can only be used on a type `container` component.
	* @default 0
	*/
	spacing: import_prop_types.default.oneOfType([
		import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([import_prop_types.default.number, import_prop_types.default.string])),
		import_prop_types.default.number,
		import_prop_types.default.object,
		import_prop_types.default.string
	]),
	/**
	* @ignore
	*/
	sx: import_prop_types.default.oneOfType([
		import_prop_types.default.arrayOf(import_prop_types.default.oneOfType([
			import_prop_types.default.func,
			import_prop_types.default.object,
			import_prop_types.default.bool
		])),
		import_prop_types.default.func,
		import_prop_types.default.object
	]),
	/**
	* @internal
	* The level of the grid starts from `0` and increases when the grid nests
	* inside another grid. Nesting is defined as a container Grid being a direct
	* child of a container Grid.
	*
	* ```js
	* <Grid container> // level 0
	*   <Grid container> // level 1
	*     <Grid container> // level 2
	* ```
	*
	* Only consecutive grid is considered nesting. A grid container will start at
	* `0` if there are non-Grid container element above it.
	*
	* ```js
	* <Grid container> // level 0
	*   <div>
	*     <Grid container> // level 0
	* ```
	*
	* ```js
	* <Grid container> // level 0
	*   <Grid>
	*     <Grid container> // level 0
	* ```
	*/
	unstable_level: import_prop_types.default.number,
	/**
	* Defines the `flex-wrap` style property.
	* It's applied for all screen sizes.
	* @default 'wrap'
	*/
	wrap: import_prop_types.default.oneOf([
		"nowrap",
		"wrap-reverse",
		"wrap"
	])
};
{
	const Component = Grid;
	const requireProp = requirePropFactory_default("Grid", Component);
	Component["propTypes"] = {
		...Component.propTypes,
		direction: requireProp("container"),
		spacing: requireProp("container"),
		wrap: requireProp("container")
	};
}
//#endregion
//#region node_modules/@mui/material/Grid/gridClasses.mjs
function getGridUtilityClass(slot) {
	return generateUtilityClass("MuiGrid", slot);
}
var SPACINGS = [
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10
];
var DIRECTIONS = ["row-reverse", "row"];
var WRAPS = [
	"nowrap",
	"wrap-reverse",
	"wrap"
];
var GRID_SIZES = [
	"auto",
	true,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12
];
var gridClasses = generateUtilityClasses("MuiGrid", [
	"root",
	"container",
	...SPACINGS.map((spacing) => `spacing-xs-${spacing}`),
	...DIRECTIONS.map((direction) => `direction-xs-${direction}`),
	...WRAPS.map((wrap) => `wrap-xs-${wrap}`),
	...GRID_SIZES.map((size) => `grid-xs-${size}`),
	...GRID_SIZES.map((size) => `grid-sm-${size}`),
	...GRID_SIZES.map((size) => `grid-md-${size}`),
	...GRID_SIZES.map((size) => `grid-lg-${size}`),
	...GRID_SIZES.map((size) => `grid-xl-${size}`)
]);
//#endregion
export { gridClasses as n, Grid as r, getGridUtilityClass as t };

//# sourceMappingURL=Grid-Cx_vltBq.js.map