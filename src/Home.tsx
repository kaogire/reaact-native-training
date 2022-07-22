import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useKeyboard} from '@react-native-community/hooks';
import BottomSheet, {
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';

const Home = () => {
  const [isDarkMode] = useState(false);
  const [textValue, setTextValue] = useState('');
  const {bottom, top} = useSafeAreaInsets();
  const [dirty, setDirty] = useState(false);
  const {keyboardShown} = useKeyboard();

  const [value, setValue] = useState(false);

  useEffect(() => {
    if (textValue.length) {
      setDirty(true);
      return;
    }
    setDirty(false);
  }, [textValue]);

  const marginBottom = useDerivedValue(
    () => withTiming(keyboardShown ? 0 : bottom + 10, {duration: 300}),
    [keyboardShown],
  );
  const borderRadius = useDerivedValue(
    () => withTiming(keyboardShown ? 0 : 10, {duration: 300}),
    [keyboardShown],
  );
  const marginHorizontal = useDerivedValue(
    () => withTiming(keyboardShown ? 0 : 16, {duration: 300}),
    [keyboardShown],
  );
  const bgColor = useDerivedValue(
    () => withTiming(dirty ? 1 : 0, {duration: 300}),
    [dirty],
  );

  const buttonStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      bgColor.value,
      [0, 1],
      ['#D0CECD', '#DC1F5C'],
    );
    return {
      marginBottom: marginBottom.value,
      marginHorizontal: marginHorizontal.value,
      borderRadius: borderRadius.value,
      backgroundColor,
    };
  }, [
    marginBottom.value,
    borderRadius.value,
    marginHorizontal.value,
    bgColor.value,
  ]);

  const outer: ViewStyle = {
    backgroundColor: value ? '#06C7CA' : '#eeeeee',
    borderColor: '#06C7CA',
    borderWidth: 0.5,
    borderRadius: 20,
    width: 35,
    height: 20,
  };

  const inner: ViewStyle = {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderColor: value ? '#06C7CA' : '#D0CECD',
    borderWidth: 0.5,
    width: 20,
    height: 19,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const left = useDerivedValue(() => {
    const leftie = withTiming(value ? 15 : 0, {
      duration: 300,
      easing: Easing.linear,
    });
    return leftie;
  }, [value]);

  const toggleStyle = useAnimatedStyle(
    () => ({
      transform: [{translateX: left.value}],
    }),
    [left.value],
  );
  useEffect(() => {
    if (value) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [value]);

  const initialSnapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const {
    animatedContentHeight,
    animatedSnapPoints,
    animatedHandleHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(initialSnapPoints);

  return (
    <View style={styles.root}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={[styles.container, {marginTop: top}]}>
          <View style={styles.content}>
            <TextInput
              value={textValue}
              onChangeText={setTextValue}
              placeholder="Enter some text"
            />
            <TouchableOpacity onPress={() => setValue(val => !val)}>
              <View style={outer}>
                <Animated.View style={[inner, toggleStyle]}>
                  <Text>v</Text>
                </Animated.View>
              </View>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Animated.View style={[styles.button, buttonStyle]}>
              <Text>Button</Text>
            </Animated.View>
          </TouchableOpacity>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          handleHeight={animatedHandleHeight}
          contentHeight={animatedContentHeight}
          enablePanDownToClose
          onClose={() => setValue(false)}
          snapPoints={animatedSnapPoints}>
          <BottomSheetView
            style={styles.bottomSheet}
            onLayout={handleContentLayout}>
            <View style={{marginBottom: 44}}>
              <Text>BottomSheet</Text>
              <Text>BottomSheet</Text>
              <Text>BottomSheet</Text>
              <Text>BottomSheet</Text>
              <Text>BottomSheet</Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setValue(false)}>
                <Text>Close</Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheet>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {flex: 1},
  bottomSheet: {
    paddingHorizontal: 16,
  },
  container: {
    justifyContent: 'space-between',
    flexDirection: 'column',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-evenly',
    marginHorizontal: 16,
  },
  button: {
    backgroundColor: '#DC1F5C',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Home;
