import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import Svg, { Circle, G, Line, Text, Path, Rect } from 'react-native-svg';
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedRect = Animated.createAnimatedComponent(Rect);
const DAY_LIST = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
// 根据点坐标返回svgpath路径字符串
const getPath = (points) => {
  const steps = [];
  const tmp = [[-4,186],...points,[348,186]]
  tmp.forEach((curr, index) => {
    if (index === 0) {
      // 起点
      steps.push('M' + curr[0] + ' ' + curr[1]);
    }
    if (index !== tmp.length - 1) {
      let next = tmp[index + 1];
      var pt1 = [(curr[0] + next[0]) * 0.5, curr[1]];
      var pt2 = [pt1[0], next[1]];
      steps.push('C' + pt1[0] + ',' + pt1[1]);
      steps.push(pt2[0] + ',' + pt2[1]);
      steps.push(next[0] + ',' + next[1]);
    }
  });
  return steps.join(' ');
};
export default function App() {
  // 图标数据
  const [points, setPoints] = useState([
    [40, 100],
    [84, 150],
    [128, 23],
    [172, 68],
    [216, 156],
    [260, 123],
    [304, 101]
  ]);
  // 初始化动画
  const [anim] = useState(new Animated.Value(0));
  const [path] = useState(
    anim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        getPath([
          [50, 240],
          [100, 240],
          [150, 240],
          [200, 240],
          [250, 240],
          [300, 240],
          [350, 240]
        ]),
        getPath(points)
      ]
    })
  );
  const [showCircle, setShowCircle] = useState(false);
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start(() => {
      setShowCircle(true);
    });
  }, []);

  const [selectIndex, setSelectIndex] = useState(-1);
  const rectYList = useRef( Array.from(Array(7), () =>new Animated.ValueXY({y:186,x:0}))).current;
  const onPress = (index) => {
    if(selectIndex >= 0){
      Animated.timing(rectYList[selectIndex], {
        toValue: {y:186,x:0},
        duration: 1000,
        useNativeDriver: true
      }).start();
    }
    setSelectIndex(index);
  };

  useEffect(()=>{
    if(selectIndex < 0)return
    Animated.timing(rectYList[selectIndex], {
      toValue: {y:points[selectIndex][1]-4,x:190-points[selectIndex][1]},
      duration: 1000,
      useNativeDriver: true
    }).start();
  },[selectIndex])

  return (
    <View style={styles.container}>
      <Animated.View>
        <Svg width='343' height='186' viewBox='0 0 343 186'>
          {/* 竖线 */}
          <G>
            <Line x1={points[0][0] - 22} y1='0' x2={points[0][0] - 22} y2='178' stroke='rgba(255,255,255,.3)' strokeWidth='1'></Line>
            {points.map((pt, index) => (
              <Line key={`line-${index}`} x1={pt[0] + 22} y1='0' x2={pt[0] + 22} y2='178' stroke='rgba(255,255,255,.3)' strokeWidth='1'></Line>
            ))}
          </G>
          <G>
            {/* 曲线 */}
            <AnimatedPath d={path} stroke='#486EF5' strokeWidth='4' fill='none' />
          </G>
          <G>
            {/* 白点 */}
            {showCircle && points.map((pt, index) => <Circle key={`pt-${index}`} id={`pt-${index}`} cx={pt[0]} cy={pt[1]} r='2' stroke='rgba(255,255,255,0.4)' strokeWidth='4' fill='#fff' />)}
          </G>
          <G>
            {/* 内容区域 */}
            {points.map((pt, index) => (
              <G>
                <AnimatedRect x={index * 44 + 19} y={rectYList[index].y} width='42' height={rectYList[index].x} rx='8' ry='8' fill='#486EF5' />
                <Text x={pt[0] - 11} y='172' fontSize='11' fill='rgb(255, 255, 255)' opacity={selectIndex === index?1:.5}>
                  {DAY_LIST[index]}
                </Text>
              </G>
            ))}
            
          </G>
          <G>
            {/* 点击区域 */}
            {DAY_LIST.map((day, idx) => (
              <Rect
                onPress={() => {
                  onPress(idx);
                }}
                x={18 + idx * 44}
                y='0'
                width='44'
                height='186'
                fill='none'
              />
            ))}
          </G>
        </Svg>
      </Animated.View>
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292C38',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
