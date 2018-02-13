/**
 *	Component
 */
Component
({
	/**
	 * 组件的属性列表
	 */
	properties:
	{
		show:
		{
			type: Boolean,
			value: false
		},
		src:
		{
			type: String,
			value: ""
		}
	},

	/**
	 * 组件的初始数据/内部数据
	 */
	data:
	{
	},

	/**
	 * 组件的方法列表
	 */
	methods:
	{
		showLoading()
		{
			this.setData
			({
				show: true
			});
		},
		hideLoading()
		{
			this.setData
			({
					show: false
			});
		}
	}



})