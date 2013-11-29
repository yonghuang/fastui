Ext.data.JsonP.global({"meta":{},"tagname":"class","files":[{"href":"","filename":""}],"alternateClassNames":[],"aliases":{},"uses":[],"subclasses":[],"component":false,"html_meta":{},"html":"<div><div class='doc-contents'><p>Global variables and functions.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-easing' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Animate.html#global-property-easing' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-easing' class='name not-expandable'>easing</a><span> : Object</span><strong class='private signature'>private</strong></div><div class='description'><div class='short'><p>内置动画算法</p>\n</div><div class='long'><p>内置动画算法</p>\n</div></div></div><div id='property-off' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Animate.html#global-property-off' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-off' class='name expandable'>off</a><span> : Boolean</span></div><div class='description'><div class='short'>是否禁用页面动画 ...</div><div class='long'><p>是否禁用页面动画</p>\n<p>Defaults to: <code>false</code></p></div></div></div><div id='property-speeds' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Animate.html#global-property-speeds' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-speeds' class='name expandable'>speeds</a><span> : Object</span><strong class='private signature'>private</strong></div><div class='description'><div class='short'>内置动画速度 ...</div><div class='long'><p>内置动画速度</p>\n<p>Defaults to: <code>{_default: 400, fast: 200, slow: 600}</code></p></div></div></div><div id='property-timers' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Animate.html#global-property-timers' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-timers' class='name expandable'>timers</a><span> : Array</span><strong class='private signature'>private</strong></div><div class='description'><div class='short'>待执行动画对象数据 ...</div><div class='long'><p>待执行动画对象数据</p>\n<p>Defaults to: <code>[]</code></p></div></div></div></div></div><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-activate' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Animate.html#global-method-activate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-activate' class='name expandable'>activate</a>( <span class='pre'></span> )<strong class='private signature'>private</strong></div><div class='description'><div class='short'>激活定时器 ...</div><div class='long'><p>激活定时器</p>\n</div></div></div><div id='method-buildAnimation' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Animate.html#global-method-buildAnimation' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-buildAnimation' class='name expandable'>buildAnimation</a>( <span class='pre'>Object elem, Object prop, Object config, Object parse</span> )<strong class='private signature'>private</strong></div><div class='description'><div class='short'>构建动画元素 ...</div><div class='long'><p>构建动画元素</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>elem</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>prop</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>config</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>parse</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-correctParam' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Animate.html#global-method-correctParam' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-correctParam' class='name expandable'>correctParam</a>( <span class='pre'>Number speed, Function easing, Function callback</span> )</div><div class='description'><div class='short'>调整动画运行参数 ...</div><div class='long'><p>调整动画运行参数</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>speed</span> : Number<div class='sub-desc'><p>动画时长</p>\n</div></li><li><span class='pre'>easing</span> : Function<div class='sub-desc'><p>动画算法</p>\n</div></li><li><span class='pre'>callback</span> : Function<div class='sub-desc'><p>回调函数</p>\n</div></li></ul></div></div></div><div id='method-createTween' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Animate.html#global-method-createTween' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-createTween' class='name expandable'>createTween</a>( <span class='pre'>Element elem, String key, String value</span> )</div><div class='description'><div class='short'>创建动画的基本属性 ...</div><div class='long'><p>创建动画的基本属性</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>elem</span> : Element<div class='sub-desc'><p>动画影响元素</p>\n</div></li><li><span class='pre'>key</span> : String<div class='sub-desc'><p>属性键</p>\n</div></li><li><span class='pre'>value</span> : String<div class='sub-desc'><p>属性值</p>\n</div></li></ul></div></div></div><div id='method-createTweens' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Animate.html#global-method-createTweens' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-createTweens' class='name expandable'>createTweens</a>( <span class='pre'>Element elem, JsonObject props</span> )</div><div class='description'><div class='short'>创建动画构成的基本属性组 ...</div><div class='long'><p>创建动画构成的基本属性组</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>elem</span> : Element<div class='sub-desc'><p>动画影响元素</p>\n</div></li><li><span class='pre'>props</span> : JsonObject<div class='sub-desc'><p>动画改变属性</p>\n</div></li></ul></div></div></div><div id='method-tick' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/Animate.html#global-method-tick' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-method-tick' class='name expandable'>tick</a>( <span class='pre'></span> )<strong class='private signature'>private</strong></div><div class='description'><div class='short'>执行动画单位时间内的一帧 ...</div><div class='long'><p>执行动画单位时间内的一帧</p>\n</div></div></div></div></div></div></div>","members":{"css_mixin":[],"event":[],"cfg":[],"property":[{"meta":{"private":true},"tagname":"property","owner":"global","name":"easing","id":"property-easing"},{"meta":{},"tagname":"property","owner":"global","name":"off","id":"property-off"},{"meta":{"private":true},"tagname":"property","owner":"global","name":"speeds","id":"property-speeds"},{"meta":{"private":true},"tagname":"property","owner":"global","name":"timers","id":"property-timers"}],"method":[{"meta":{"private":true},"tagname":"method","owner":"global","name":"activate","id":"method-activate"},{"meta":{"private":true},"tagname":"method","owner":"global","name":"buildAnimation","id":"method-buildAnimation"},{"meta":{},"tagname":"method","owner":"global","name":"correctParam","id":"method-correctParam"},{"meta":{},"tagname":"method","owner":"global","name":"createTween","id":"method-createTween"},{"meta":{},"tagname":"method","owner":"global","name":"createTweens","id":"method-createTweens"},{"meta":{"private":true},"tagname":"method","owner":"global","name":"tick","id":"method-tick"}],"css_var":[]},"mixedInto":[],"superclasses":[],"parentMixins":[],"statics":{"css_mixin":[],"event":[],"cfg":[],"property":[],"method":[],"css_var":[]},"name":"global","mixins":[],"requires":[]});