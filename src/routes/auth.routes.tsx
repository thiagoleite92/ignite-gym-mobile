import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack'
import { SignIn } from '@screens/SignIn'
import { SignUp } from '@screens/SignUp'

type AuthRoutes = {
  'sign-in': undefined
  'sign-up': undefined
}

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>()

export type AuthNavigatorRouterProps = NativeStackNavigationProp<AuthRoutes>

export function AuthRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="sign-in" component={SignIn} />
      <Screen name="sign-up" component={SignUp} />
    </Navigator>
  )
}
