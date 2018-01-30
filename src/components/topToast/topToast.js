// components/top-toast/top-toast.js
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
		mode:
		{
			type: String,
			value: "err"
		},
		delay:
		{
			type	: Number,
			value	: 3000
		},

		//	显示的消息
		message :
		{
			//	类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
			type	: String,

			//	属性初始值（可选），如果未指定则会根据类型选择一个
			value	: "消息内容"
		},
	},

	/**
	 * 组件的初始数据/内部数据
	 */
	data:
	{
		m_nInterval	: null
	},

	/**
	 * 组件的方法列表
	 */
	methods:
	{
		//	展示弹框
		showTopToast( sMode, sMessage )
		{
			this.setData
			({
				message : sMessage,
				mode: sMode,
				show: true
			});
			this._createInterval();
		},

		//	隐藏弹框
		hideTopToast()
		{
			this.setData
			({
					show: false
			});
		},

		/*
		 *	内部私有方法
		 *	triggerEvent 用于触发事件
		 */
		_cancelEvent()
		{
			//	触发取消回调
			this.triggerEvent( "cancelEvent" )
		},

		/**
		 *	@ private
		 */
		_createInterval()
		{
			if ( null !== this.data.m_nInterval )
			{
				clearTimeout( this.data.m_nInterval );
				this.data.m_nInterval = null;
			}

			//	...
			setTimeout( () =>
				{
					this.hideTopToast();
				},
				this.properties.delay > 0 ? this.properties.delay : 3000
			);
		}



	}



})