import React, { Component } from 'react'
import { ActivityIndicator, KeyboardAvoidingView, View, Image, TextInput, Text } from 'react-native'
import defaultStyles from './defaultStyles.js'
import TouchableOpacity from '../common/touchableOpacity'
import { formatMonthYearExpiry } from '../../common/cardFormatting'
import _ from 'lodash'

export default class AddCard extends Component {
  constructor(props) {
    super(props)
    this.state = { addingCard: false, cardNumber: '', error: null, expiry: '', cvc: '' }
  }

  componentDidMount() {
    this.refs.cardNumber.focus()
  }

  render() {
    const styles = _.merge({}, defaultStyles, this.props.styles)

    const addCardContents = (
      <View>
        <View style={styles.cardNumberContainer}>
          <Image resizeMode="contain" style={styles.cardNumberImage} source={require('../../../assets/images/card_front.png')} />
          <TextInput
            ref="cardNumber"
            keyboardType="numeric"
            style={styles.cardNumberInput}
            onChangeText={(cardNumber) => this.setState({ cardNumber })}
            value={this.state.cardNumber}
            placeholder="4242424242424242"
            onFocus={() => this.props.onCardNumberFocus && this.props.onCardNumberFocus(this.state.cardNumber)}
            onBlur={() => this.props.onCardNumberBlur && this.props.onCardNumberBlur(this.state.cardNumber)}
          />
        </View>
        <View style={styles.monthYearContainer}>
          <Image resizeMode="contain" style={styles.cardExpiryImage} source={require('../../../assets/images/card_expiry.png')} />
          <TextInput
            maxLength={5}
            keyboardType="numeric"
            style={styles.monthYearTextInput}
            onChangeText={(expiry) => {
              const newExpiry = formatMonthYearExpiry(expiry, this.state.expiry)
              this.setState({ expiry: newExpiry })
              if (_.size(newExpiry) === 5) {
                this.refs.cvcInput.focus()
              }
            }}
            value={this.state.expiry}
            placeholder="MM/YY"
            onFocus={() => this.props.onExpiryFocus && this.props.onExpiryFocus(this.state.expiry)}
            onBlur={() => this.props.onExpiryBlur && this.props.onExpiryBlur(this.state.expiry)}
          />
        </View>
        <View style={styles.cvcContainer}>
          <Image resizeMode="contain" style={styles.cvcImage} source={require('../../../assets/images/card_cvc.png')} />
          <TextInput
            ref="cvcInput"
            keyboardType="numeric"
            style={styles.cvcInput}
            onChangeText={(cvc) => this.setState({ cvc })}
            value={this.state.cvc}
            placeholder="CVC"
            onFocus={() => this.props.onCvcFocus && this.props.onCvcFocus(this.state.cvc)}
            onBlur={() => this.props.onCvcBlur && this.props.onCvcBlur(this.state.cvc)}
          />
        </View>
        <Text style={styles.errorText}>{this.state.error}</Text>
          <TouchableOpacity
            style={styles.addButton}
            styles={styles}
            onPress={() => {
              this.setState({ addingCard: true })
              this.props.addCardHandler(this.state.cardNumber, this.state.expiry, this.state.cvc)
                .then(() => this.setState({ addingCard: false }))
                .catch((error) => this.setState({ error: error.message, addingCard: false }))
            }}
            last
          >
            <Text style={styles.addButtonText}>Add Card</Text>
          </TouchableOpacity>
      </View>
    )
    return (
      <KeyboardAvoidingView behavior="position" style={styles.addCardContainer}>
        {this.state.addingCard ? <ActivityIndicator size="large" style={styles.activityIndicator} /> : addCardContents}
      </KeyboardAvoidingView>
    )
  }
}
