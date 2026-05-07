const fs = require('fs');
const path = './apps/mobile-app/app/(tabs)/_layout.tsx';
let content = fs.readFileSync(path, 'utf8');

// Normalize line endings to \n temporarily
content = content.replace(/\r\n/g, '\n');

// 1. Add badge to CustomTabBarButton
content = content.replace(
  '          {children}\n        </View>\n      </TouchableOpacity>',
  '          {children}\n          {isOnline === false && (\n            <View style={{ position: \'absolute\', top: -4, right: -4, backgroundColor: \'#f43f5e\', borderRadius: 12, padding: 3, borderWidth: 2, borderColor: theme.bg }}>\n              <MaterialIcons name="cloud-off" size={14} color="white" />\n            </View>\n          )}\n        </View>\n      </TouchableOpacity>'
);

// 2. Wrap return ( <Tabs... ) with View and banner
content = content.replace(
  '  return (\n    <Tabs',
  '  return (\n    <View style={{ flex: 1, backgroundColor: theme.bg }}>\n      {!isOnline && (\n        <View style={{\n          paddingTop: insets.top,\n          backgroundColor: \'#f59e0b\',\n          zIndex: 50\n        }}>\n          <View style={{\n            paddingVertical: 6,\n            paddingHorizontal: 16,\n            flexDirection: \'row\',\n            alignItems: \'center\',\n            justifyContent: \'center\',\n            gap: 8,\n          }}>\n            <MaterialIcons name="cloud-off" size={16} color="white" />\n            <Text style={{ color: \'white\', fontSize: 12, fontWeight: \'bold\' }}>\n              📡 Sin conexión. Los cambios se guardarán localmente.\n            </Text>\n          </View>\n        </View>\n      )}\n      <Tabs'
);

// 3. Close the wrapper View at the end of Tabs
content = content.replace(
  '    </Tabs>\n  );\n}',
  '    </Tabs>\n    </View>\n  );\n}'
);

// 4. Pass isOnline to CustomTabBarButton
content = content.replace(
  '<CustomTabBarButton theme={theme} {...props}>',
  '<CustomTabBarButton theme={theme} isOnline={isOnline} {...props}>'
);

// Restore \r\n line endings
content = content.replace(/\n/g, '\r\n');

fs.writeFileSync(path, content);
console.log('Done successfully.');
