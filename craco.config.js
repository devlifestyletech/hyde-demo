const CracoLessPlugin = require("craco-less");

module.exports = {
	plugins: [
		{
			plugin: CracoLessPlugin,
			options: {
				lessLoaderOptions: {
					lessOptions: {
						modifyVars: {
							"@primary-color": "#D8AA81",
							"@menu-item-active-bg": "#FFFFFF",
							"@btn-default-color": "#1D1C1C",
							"@tabs-highlight-color": "#1D1C1C",
							"@table-header-bg": "#D3D3D3",
							"@table-border-radius-base": "10px",
							"@menu-item-color": "#1D1C1C",
							"@font-family": "SukhumvitSet"
						},
						javascriptEnabled: true
					}
				}
			}
		}
	]
};
