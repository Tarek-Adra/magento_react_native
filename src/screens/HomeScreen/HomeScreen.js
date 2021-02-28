import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { GenericTemplate, Card, Text } from '../../common';
import { magento } from '../../magento';
// import FeaturedCategoryList from './FeaturedCategoryList';
// import CategoryList from './CategoryList';
import Image from '../../common/Image/Image';
import Status from '../../magento/Status';
import { DIMENS, SPACING } from '../../constants';
import { ThemeContext } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import { NAVIGATION_TO_CATEGORY_PRODUCT_LIST_SCREEN } from '../../navigation/routes';

const propTypes = {
  /**
   * Tells about the status of the fetch cmsBlockData api call
   * cmsBlockData contains the data need to be shown in HomeScreen
   *
   * if status === Status.DEFAULT => api hasn't been hit yet
   * if status === Status.LOADING => api is currently being executed
   * if status === Status.SUCCESS => success response from api
   * if status === Status.ERROR   => error response from api or error
   *                                 in initMagento generator function in appSagas.js
   *
   * @source redux
   */
  status: PropTypes.oneOf(Object.values(Status)).isRequired,
  /**
   * error message if status === Status.ERROR
   *
   * @source redux
   */
  errorMessage: PropTypes.string,
  slider: PropTypes.arrayOf(
    PropTypes.shape({ image: PropTypes.string.isRequired }),
  ),
  // eslint-disable-next-line react/forbid-prop-types
  featuredCategories: PropTypes.object,
};

const defaultProps = {
  slider: [],
  featuredCategories: {},
  errorMessage: '',
};

const HomeScreen = ({ status, errorMessage, slider, featuredCategories }) => {
  console.log(DIMENS.common.WINDOW_WIDTH);
  const navigation = useNavigation();

  const onCardPress = (id, name) => {
    console.log(id, name, "xxxxxxxxxxxxxxxxxxxxxx");
    navigation.navigate(NAVIGATION_TO_CATEGORY_PRODUCT_LIST_SCREEN, {
      title: name,
      id: parseFloat(id),
    });
  };

  const media = useMemo(
    () =>
      slider.map(slide => ({
        source: { uri: `${magento.getMediaUrl()}${slide.image}` },
      })),
    [slider],
  );
  return (
    <GenericTemplate scrollable status={status} errorMessage={errorMessage}>
      {/* <ImageSlider
        autoplay
        containerStyle={styles.imageSliderContainer}
        media={media}
        height={DIMENS.homeScreen.sliderHeight}
      /> */}
      <View style={styles.cardView}>
        {Object.keys(featuredCategories).map(key => (
          <Card onPress={() => onCardPress(key, featuredCategories[key].title)}
            type="shadow" style={styles.container(ThemeContext, 3)} key={key} >
            <Image
              source={{ uri: `${magento.getMediaUrl()}${featuredCategories[key].image}` }}
              style={styles.imageStyle}
              resizeMode="contain"
            />
            <Text type="label" bold style={styles.title}>
              {featuredCategories[key].title}
            </Text>
            {/* <CategoryList categoryId={parseInt(key, 10)} img /> */}
          </Card>
        ))}
      </View>
    </GenericTemplate>
  );
};

const styles = StyleSheet.create({
  container: (theme, columnCount) => ({
    width:
      columnCount > 1
        ? (DIMENS.common.WINDOW_WIDTH - 50) / columnCount
        : DIMENS.catalogGridItemWidth,
    height: 150,
    marginTop: SPACING.small,
  }),
  imageSliderContainer: {
    height: DIMENS.homeScreen.sliderHeight,
  },
  imageStyle: {
    height: DIMENS.catalogGridItemImageHeight,
  },
  cardView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#F5F5F5',
    justifyContent: 'space-evenly',
  },
  title: {
    textAlign: 'center'
  },
});

HomeScreen.propTypes = propTypes;

HomeScreen.defaultProps = defaultProps;

const mapStatetoProps = ({ home }) => {
  const { status, errorMessage, slider, featuredCategories } = home;
  return {
    status,
    slider,
    errorMessage,
    featuredCategories,
  };
};



export default connect(mapStatetoProps)(HomeScreen);
