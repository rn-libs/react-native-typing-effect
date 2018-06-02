import React, { Component } from 'react'
import PT from 'prop-types'
import { Text, View, StyleSheet, Animated } from 'react-native'


export class TypingIndicator extends Component {
  constructor(props) {
    super(props)
    this.animated = []
    this.pointCount = props.pointCount
    this.values = [1, 0]
    this.createAnimatedValue()
  }

  componentDidMount() {
    this.animation()
  }

  createAnimation = (value) => Animated
    .timing(value, {
      toValue: this.values[1],
      duration: 150,
    })

  animation = () => {
    this.values.reverse()
    this.setValue(this.values[0])
    Animated.sequence(this.getAnimation())
      .start(() => this.animation())
  }

  createInterpolateAnimation = (i) => ({
    scale: this.animated[i].interpolate({
      inputRange: [0, 1],
      outputRange: [2, 4],
    }),
    opacity: this.animated[i].interpolate({
      inputRange: [0, 1],
      outputRange: [0.5, 0.8],
    }),
  })

  createAnimatedValue = () => {
    for (let i = 0; i < this.pointCount; i++) {
      this.animated[i] = new Animated.Value(0)
    }
  }

  getAnimation = () => {
    const rs = []

    for (let i = 0; i < this.pointCount; i++) {
      rs.push(this.createAnimation(this.animated[i]))
    }
    
    return rs
  }

  setValue = (val) => {
    for (let i = 0; i < this.pointCount; i++) {
      this.animated[i].setValue(val)
    }
  }

  render() {
    if (!this.props.isShow) {
      return null
    }

    return (
      <View
        style={[
          styles.container,
          this.props.containerStyle && this.props.containerStyle,
        ]}
      >
        {this.animated.map((_, i) => {
          const { scale, opacity } = this.createInterpolateAnimation(i)
          
          return (
            <Animated.Text
              style={[
                { transform: [{ scale }], opacity },
                styles.text,
                this.props.textStyle && this.props.textStyle,
              ]}
            >
              .
            </Animated.Text>
          )
        })}
      </View>
    )
  }
}

TypingIndicator.propTypes = {
  pointCount: PT.number,
  duration: PT.number,
  isShow: PT.bool,
}

TypingIndicator.defaultProps = {
  pointCount: 3,
  duration: 150,
  isShow: true,
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  text: {
     fontWeight: 'bold',
     paddingRight: 5,
  },
})
