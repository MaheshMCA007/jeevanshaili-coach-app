import { Drawer } from 'expo-router/drawer';
import { useWindowDimensions } from 'react-native';
import Sidebar from '../../components/Sidebar';

export default function DrawerLayout() {
    const { width } = useWindowDimensions();
    const isLargeScreen = width >= 1024;

    return (
        <Drawer
            drawerContent={(props) => <Sidebar {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: isLargeScreen ? 'permanent' : 'front',
                drawerStyle: {
                    width: 280,
                    backgroundColor: '#ffffff',
                    borderRightWidth: 0,
                },
                overlayColor: 'rgba(0,0,0,0.5)',
            }}
        >
            <Drawer.Screen
                name="index"
                options={{ title: 'Home' }}
            />
            <Drawer.Screen
                name="clients"
                options={{ title: 'Clients' }}
            />
            <Drawer.Screen
                name="leads"
                options={{ title: 'Leads' }}
            />
            <Drawer.Screen
                name="followups"
                options={{ title: 'Follow-ups' }}
            />
            <Drawer.Screen
                name="workouts"
                options={{ title: 'Workouts' }}
            />
            <Drawer.Screen
                name="meals"
                options={{ title: 'Meals' }}
            />
            <Drawer.Screen
                name="pricing-plans"
                options={{ title: 'Pricing Plans' }}
            />
            <Drawer.Screen
                name="settings"
                options={{ title: 'Settings' }}
            />
        </Drawer>
    );
}
