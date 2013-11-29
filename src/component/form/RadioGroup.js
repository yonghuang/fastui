/**
 * @class fastDev.Ui.RadioGroup
 * @extends fastDev.Ui.Component
 * 单选框组控件，继承自CheckBoxGroup，表单类组件。<p>
 * 作者：姜玲
 *
 *		 <div itype="RadioGroup" name="check2" id="check2">
 *			<div value="1" text="足球" ></div>			
 *			<div value="2" text="排球" checked=true></div>
 *			<div value="3" text="羽毛球"></div>
 *			<div value="4" text="乒乓球"></div>
 *		</div>
 */
fastDev.define("fastDev.Ui.RadioGroup", {
	extend : "fastDev.Ui.CheckBoxGroup",
	alias : "RadioGroup",
	_options : {
		/**
		 * 是否允许多选
		 * @type {Boolean}
		 */
		allowMultiSelect:false	
	}
});
