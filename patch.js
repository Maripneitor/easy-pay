
const fs = require('fs');
const path = './apps/mobile-app/app/(tabs)/_layout.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '{children}\r\n        </View>\r\n      </TouchableOpacity>',
  \{children}
          {isOnline === false && (
            <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: '#f43f5e', borderRadius: 12, padding: 3, borderWidth: 2, borderColor: theme.bg }}>
              <MaterialIcons name='cloud-off' size={14} color='white' />
            </View>
          )}
        </View>
      </TouchableOpacity>\
);
content = content.replace(
  '{children}\n        </View>\n      </TouchableOpacity>',
  \{children}
          {isOnline === false && (
            <View style={{ position: 'absolute', top: -4, right: -4, backgroundColor: '#f43f5e', borderRadius: 12, padding: 3, borderWidth: 2, borderColor: theme.bg }}>
              <MaterialIcons name='cloud-off' size={14} color='white' />
            </View>
          )}
        </View>
      </TouchableOpacity>\
);

content = content.replace(
  '  return (\r\n    <Tabs',
  \  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {!isOnline && (
        <View style={{
          paddingTop: insets.top,
          backgroundColor: '#f59e0b',
          zIndex: 50
        }}>
          <View style={{
            paddingVertical: 6,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <MaterialIcons name='cloud-off' size={16} color='white' />
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              ?? Sin conexión. Los cambios se guardarán localmente.
            </Text>
          </View>
        </View>
      )}
      <Tabs\
);
content = content.replace(
  '  return (\n    <Tabs',
  \  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      {!isOnline && (
        <View style={{
          paddingTop: insets.top,
          backgroundColor: '#f59e0b',
          zIndex: 50
        }}>
          <View style={{
            paddingVertical: 6,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}>
            <MaterialIcons name='cloud-off' size={16} color='white' />
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              ?? Sin conexión. Los cambios se guardarán localmente.
            </Text>
          </View>
        </View>
      )}
      <Tabs\
);

content = content.replace(
  '    </Tabs>\r\n  );\r\n}',
  \    </Tabs>
    </View>
  );
}\
);
content = content.replace(
  '    </Tabs>\n  );\n}',
  \    </Tabs>
    </View>
  );
}\
);

content = content.replace(
  '<CustomTabBarButton theme={theme} {...props}>',
  '<CustomTabBarButton theme={theme} isOnline={isOnline} {...props}>'
);

fs.writeFileSync(path, content);
console.log('Done');

