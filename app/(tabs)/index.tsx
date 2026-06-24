import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput, TouchableOpacity, Image, Platform, Dimensions, useColorScheme } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const BASE_COLORS = {
  primaryGreen: '#A6C63F',
  secondaryGreen: '#BCD67A',
  background: '#A6ACA4',
  cardBackground: '#F5F5F5',
  darkSurface: '#565A56',
  white: '#FFFFFF',
  primaryText: '#1F1F1F',
  secondaryText: '#666666',
};

export default function HomeDashboard() {
  const [activeTab, setActiveTab] = useState('tracking');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const COLORS = {
    ...BASE_COLORS,
    screenBg: isDark ? '#121212' : '#F8F9FA', // Using a lighter bg for content rather than the raw A6ACA4 for readability, but keeping it as requested for accents
    cardBg: isDark ? '#1E1E1E' : BASE_COLORS.white,
    text: isDark ? '#FFFFFF' : BASE_COLORS.primaryText,
    textMuted: isDark ? '#A0A0A0' : BASE_COLORS.secondaryText,
    surface: isDark ? '#2C2C2C' : BASE_COLORS.cardBackground,
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: COLORS.screenBg }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?img=11' }} 
              style={styles.profileImage} 
            />
            <View>
              <Text style={[styles.greeting, { color: COLORS.textMuted }]}>Good Morning 👋</Text>
              <Text style={[styles.userName, { color: COLORS.text }]}>Arko</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: COLORS.cardBg }]}>
              <Feather name="bell" size={22} color={COLORS.text} />
              <View style={styles.badge} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: COLORS.cardBg }]}>
              <Feather name="message-square" size={22} color={COLORS.text} />
              <View style={styles.badgeContainer}>
                <Text style={styles.badgeText}>2</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search & Tracking Card */}
        <Animated.View entering={FadeInDown.delay(100).springify()} style={[styles.searchCard, { backgroundColor: COLORS.cardBg }]}>
          <View style={[styles.searchTabs, { backgroundColor: COLORS.surface }]}>
            <TouchableOpacity 
              style={[styles.searchTab, activeTab === 'tracking' && { backgroundColor: COLORS.cardBg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }]}
              onPress={() => setActiveTab('tracking')}
            >
              <Text style={[styles.searchTabText, { color: activeTab === 'tracking' ? COLORS.text : COLORS.textMuted }, activeTab === 'tracking' && styles.activeSearchTabText]}>
                Tracking ID
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.searchTab, activeTab === 'awb' && { backgroundColor: COLORS.cardBg, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }]}
              onPress={() => setActiveTab('awb')}
            >
              <Text style={[styles.searchTabText, { color: activeTab === 'awb' ? COLORS.text : COLORS.textMuted }, activeTab === 'awb' && styles.activeSearchTabText]}>
                AWB Number
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.searchBarContainer, { backgroundColor: COLORS.surface }]}>
            <TextInput 
              placeholder="Enter Tracking ID"
              placeholderTextColor={COLORS.textMuted}
              style={[styles.searchInput, { color: COLORS.text }]}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Feather name="search" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <ActionCard icon="package" title="Send Parcel" delay={200} colors={COLORS} />
            <ActionCard icon="map-pin" title="Track Parcel" delay={300} colors={COLORS} />
            <ActionCard icon="calendar" title="Schedule Pickup" delay={400} colors={COLORS} />
            <ActionCard icon="file-text" title="Delivery History" delay={500} colors={COLORS} />
          </View>
        </View>

        {/* Active Shipment Card */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: COLORS.text }]}>Active Shipment</Text>
          <Animated.View entering={FadeInDown.delay(600).springify()} style={[styles.activeShipmentCard, { backgroundColor: COLORS.cardBg }]}>
            <View style={styles.shipmentHeader}>
              <View>
                <Text style={styles.shipmentStatus}>In Transit</Text>
                <Text style={[styles.trackingNumber, { color: COLORS.text }]}>TRK1234567890</Text>
              </View>
              <View style={[styles.routeContainer, { backgroundColor: COLORS.surface }]}>
                <Text style={[styles.routeCity, { color: COLORS.text }]}>Kolkata</Text>
                <Feather name="arrow-right" size={16} color={COLORS.primaryGreen} style={{ marginHorizontal: 8 }} />
                <Text style={[styles.routeCity, { color: COLORS.text }]}>Mumbai</Text>
              </View>
            </View>

            <View style={styles.deliveryInfoRow}>
              <View style={styles.infoBox}>
                <Feather name="clock" size={16} color={COLORS.textMuted} />
                <Text style={[styles.infoText, { color: COLORS.textMuted }]}>ETA Today 07:30 PM</Text>
              </View>
              <View style={styles.infoBox}>
                <Feather name="alert-circle" size={16} color={COLORS.textMuted} />
                <Text style={[styles.infoText, { color: COLORS.textMuted }]}>2h 15m left</Text>
              </View>
            </View>

            <View style={[styles.driverSection, { borderTopColor: COLORS.surface }]}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=33' }} style={styles.driverAvatar} />
              <View style={styles.driverDetails}>
                <Text style={[styles.driverName, { color: COLORS.text }]}>Rohit Kumar</Text>
                <Text style={[styles.driverRating, { color: COLORS.textMuted }]}>4.8 ⭐</Text>
              </View>
              <View style={styles.driverActions}>
                <TouchableOpacity style={styles.driverActionButton}>
                  <Feather name="phone" size={18} color={COLORS.primaryGreen} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.driverActionButton}>
                  <Feather name="message-circle" size={18} color={COLORS.primaryGreen} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.mapPreview}>
               <LinearGradient colors={['#E8F0D1', '#F5F5F5']} style={styles.mapGradient}>
                 <View style={styles.mapLine} />
                 <View style={[styles.mapMarker, { left: '10%' }]} />
                 <View style={[styles.mapMarker, { left: '80%', backgroundColor: COLORS.primaryGreen }]} />
               </LinearGradient>
            </View>

            <TouchableOpacity style={styles.liveTrackingButton}>
              <Text style={styles.liveTrackingButtonText}>Live Tracking</Text>
            </TouchableOpacity>

          </Animated.View>
        </View>

        {/* Promotional Banner */}
        <Animated.ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bannerContainer}
          entering={FadeInRight.delay(700).springify()}
        >
          <LinearGradient 
            colors={[COLORS.primaryGreen, COLORS.secondaryGreen]} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={styles.bannerCard}
          >
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Flat 20% OFF</Text>
              <Text style={styles.bannerSubtitle}>On your next shipment</Text>
              <View style={styles.couponBox}>
                <Text style={[styles.couponText, { color: BASE_COLORS.primaryText }]}>FAST20</Text>
              </View>
            </View>
            <Feather name="gift" size={60} color="rgba(255,255,255,0.3)" style={styles.bannerIcon} />
          </LinearGradient>
          
          <LinearGradient 
            colors={[BASE_COLORS.darkSurface, '#333']} 
            start={{ x: 0, y: 0 }} 
            end={{ x: 1, y: 1 }} 
            style={styles.bannerCard}
          >
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>Pro Delivery</Text>
              <Text style={[styles.bannerSubtitle, { color: '#ccc' }]}>Upgrade your experience</Text>
              <View style={[styles.couponBox, { backgroundColor: COLORS.primaryGreen }]}>
                <Text style={[styles.couponText, { color: BASE_COLORS.white }]}>EXPLORE</Text>
              </View>
            </View>
            <Feather name="zap" size={60} color="rgba(255,255,255,0.1)" style={styles.bannerIcon} />
          </LinearGradient>
        </Animated.ScrollView>

        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const ActionCard = ({ icon, title, delay, colors }: any) => (
  <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.actionCardWrapper}>
    <TouchableOpacity style={[styles.actionCard, { backgroundColor: colors.cardBg }]}>
      <View style={styles.actionIconContainer}>
        <Feather name={icon} size={28} color={colors.primaryGreen} />
      </View>
      <Text style={[styles.actionTitle, { color: colors.text }]}>{title}</Text>
    </TouchableOpacity>
  </Animated.View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  greeting: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'sans-serif',
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  badge: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4B4B',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeContainer: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#FF4B4B',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  searchCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  searchTabs: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
  },
  searchTab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  searchTabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  activeSearchTabText: {
    fontWeight: 'bold',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
  },
  searchButton: {
    backgroundColor: BASE_COLORS.primaryGreen,
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  actionCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 2,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(166, 198, 63, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  activeShipmentCard: {
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  shipmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  shipmentStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: BASE_COLORS.primaryGreen,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  trackingNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  routeCity: {
    fontSize: 12,
    fontWeight: '600',
  },
  deliveryInfoRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  infoText: {
    fontSize: 13,
    marginLeft: 6,
    fontWeight: '500',
  },
  driverSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    marginBottom: 20,
  },
  driverAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  driverRating: {
    fontSize: 13,
  },
  driverActions: {
    flexDirection: 'row',
  },
  driverActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(166, 198, 63, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  mapPreview: {
    height: 80,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapGradient: {
    flex: 1,
    justifyContent: 'center',
  },
  mapLine: {
    position: 'absolute',
    left: '10%',
    right: '20%',
    height: 2,
    backgroundColor: BASE_COLORS.primaryGreen,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: BASE_COLORS.primaryGreen,
  },
  mapMarker: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: BASE_COLORS.white,
    borderWidth: 3,
    borderColor: BASE_COLORS.primaryGreen,
  },
  liveTrackingButton: {
    backgroundColor: BASE_COLORS.darkSurface,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  liveTrackingButtonText: {
    color: BASE_COLORS.white,
    fontSize: 15,
    fontWeight: 'bold',
  },
  bannerContainer: {
    paddingBottom: 20,
  },
  bannerCard: {
    width: width * 0.75,
    height: 140,
    borderRadius: 24,
    padding: 20,
    marginRight: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    zIndex: 1,
  },
  bannerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BASE_COLORS.white,
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
  },
  couponBox: {
    backgroundColor: BASE_COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  couponText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  bannerIcon: {
    position: 'absolute',
    right: -10,
    bottom: -10,
    zIndex: 0,
    transform: [{ rotate: '-15deg' }],
  }
});
