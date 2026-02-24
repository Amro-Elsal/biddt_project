import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/app_theme.dart';

/// Home Discovery Screen
/// Design from Stitch: home_discovery_light_mode
class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  int _selectedCategory = 0;

  final List<String> _categories = [
    'All',
    'Electronics',
    'Fashion',
    'Home',
    'Sports',
    'Collectibles',
    'Vehicles',
  ];

  final List<ListingItem> _listings = [
    ListingItem(
      id: '1',
      title: 'Vintage Film Camera',
      currentBid: 245,
      imageUrl: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400',
      timeLeft: '2h 15m',
      bidsCount: 12,
      sellerName: 'Sarah M.',
      sellerRating: 4.8,
      isLive: true,
    ),
    ListingItem(
      id: '2',
      title: 'Mechanical Keyboard',
      currentBid: 180,
      imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=400',
      timeLeft: '4h 30m',
      bidsCount: 8,
      sellerName: 'Mike T.',
      sellerRating: 4.9,
      isLive: true,
    ),
    ListingItem(
      id: '3',
      title: 'Leather Jacket',
      currentBid: 95,
      imageUrl: 'https://images.unsplash.com/photo-1551028919-ac76c9028d1e?w=400',
      timeLeft: '1d 2h',
      bidsCount: 5,
      sellerName: 'Alex K.',
      sellerRating: 4.7,
      isLive: false,
    ),
    ListingItem(
      id: '4',
      title: 'Gaming Headset',
      currentBid: 75,
      imageUrl: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=400',
      timeLeft: '6h 45m',
      bidsCount: 15,
      sellerName: 'Jordan P.',
      sellerRating: 5.0,
      isLive: true,
    ),
  ];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final backgroundColor =
        isDark ? AppColors.backgroundDark : const Color(0xFFF8F8F5);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // App Bar
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 16, 20, 8),
                child: Row(
                  children: [
                    // Location
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 8,
                      ),
                      decoration: BoxDecoration(
                        color: isDark
                            ? AppColors.surfaceDark
                            : const Color(0xFFE7E5DA),
                        borderRadius: BorderRadius.circular(20),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            Icons.location_on,
                            size: 16,
                            color: AppColors.gold,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            'Halifax, NS',
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: isDark
                                  ? AppColors.textPrimaryDark
                                  : const Color(0xFF181710),
                            ),
                          ),
                          Icon(
                            Icons.keyboard_arrow_down,
                            size: 16,
                            color: isDark
                                ? AppColors.textSecondaryDark
                                : const Color(0xFF64748B),
                          ),
                        ],
                      ),
                    ),

                    const Spacer(),

                    // Notifications
                    Stack(
                      children: [
                        IconButton(
                          icon: Icon(
                            Icons.notifications_outlined,
                            color: isDark
                                ? AppColors.textPrimaryDark
                                : const Color(0xFF181710),
                          ),
                          onPressed: () {},
                        ),
                        Positioned(
                          right: 8,
                          top: 8,
                          child: Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: AppColors.error,
                              shape: BoxShape.circle,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            // Search Bar
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 16),
                child: Container(
                  decoration: BoxDecoration(
                    color: isDark
                        ? AppColors.surfaceDark
                        : const Color(0xFFE7E5DA),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: TextField(
                    controller: _searchController,
                    decoration: InputDecoration(
                      hintText: 'Search treasures...',
                      hintStyle: TextStyle(
                        color: isDark
                            ? AppColors.textTertiaryDark
                            : const Color(0xFF94A3B8),
                      ),
                      prefixIcon: Icon(
                        Icons.search,
                        color: isDark
                            ? AppColors.textSecondaryDark
                            : const Color(0xFF64748B),
                      ),
                      suffixIcon: Container(
                        margin: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: AppColors.gold,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(
                          Icons.tune,
                          size: 20,
                          color: Color(0xFF181710),
                        ),
                      ),
                      border: InputBorder.none,
                      contentPadding: const EdgeInsets.symmetric(
                        horizontal: 16,
                        vertical: 16,
                      ),
                    ),
                  ),
                ),
              ),
            ),

            // Categories
            SliverToBoxAdapter(
              child: SizedBox(
                height: 44,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  itemCount: _categories.length,
                  itemBuilder: (context, index) {
                    final isSelected = _selectedCategory == index;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedCategory = index),
                      child: AnimatedContainer(
                        duration: AppTheme.durationFast,
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? AppColors.gold
                              : isDark
                                  ? AppColors.surfaceDark
                                  : const Color(0xFFE7E5DA),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Center(
                          child: Text(
                            _categories[index],
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: isSelected
                                  ? const Color(0xFF181710)
                                  : isDark
                                      ? AppColors.textSecondaryDark
                                      : const Color(0xFF64748B),
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ),
            ),

            // Section Title
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 16),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Live Auctions',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: isDark
                            ? AppColors.textPrimaryDark
                            : const Color(0xFF181710),
                      ),
                    ),
                    TextButton(
                      onPressed: () {},
                      child: Text(
                        'See All',
                        style: TextStyle(
                          color: AppColors.primary,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Listings Grid
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              sliver: SliverGrid(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.75,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                ),
                delegate: SliverChildBuilderDelegate(
                  (context, index) {
                    final listing = _listings[index];
                    return _buildListingCard(listing, isDark);
                  },
                  childCount: _listings.length,
                ),
              ),
            ),

            // Bottom padding
            const SliverToBoxAdapter(
              child: SizedBox(height: 100),
            ),
          ],
        ),
      ),

      // Floating Action Button
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () {},
        backgroundColor: AppColors.gold,
        foregroundColor: const Color(0xFF181710),
        icon: const Icon(Icons.add),
        label: const Text(
          'Sell',
          style: TextStyle(fontWeight: FontWeight.w700),
        ),
      ),

      // Bottom Navigation
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: isDark ? AppColors.surfaceDark : Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _buildNavItem(Icons.home, 'Home', true),
                _buildNavItem(Icons.search, 'Browse', false),
                const SizedBox(width: 48), // Space for FAB
                _buildNavItem(Icons.chat_bubble_outline, 'Messages', false),
                _buildNavItem(Icons.person_outline, 'Profile', false),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildListingCard(ListingItem listing, bool isDark) {
    return GestureDetector(
      onTap: () {
        // Navigate to product detail
      },
      child: Container(
        decoration: BoxDecoration(
          color: isDark ? AppColors.surfaceDark : Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Image
            Expanded(
              flex: 3,
              child: Stack(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(
                      top: Radius.circular(16),
                    ),
                    child: Image.network(
                      listing.imageUrl,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  if (listing.isLive)
                    Positioned(
                      top: 8,
                      left: 8,
                      child: Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: AppColors.error,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 6,
                              height: 6,
                              decoration: const BoxDecoration(
                                color: Colors.white,
                                shape: BoxShape.circle,
                              ),
                            )
                                .animate(onPlay: (controller) => controller.repeat())
                                .fadeOut(duration: 800.ms)
                                .fadeIn(duration: 800.ms),
                            const SizedBox(width: 4),
                            const Text(
                              'LIVE',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  // Time left
                  Positioned(
                    bottom: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 4,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.6),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        listing.timeLeft,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Content
            Expanded(
              flex: 2,
              child: Padding(
                padding: const EdgeInsets.all(12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      listing.title,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: isDark
                            ? AppColors.textPrimaryDark
                            : const Color(0xFF181710),
                      ),
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(
                          Icons.star,
                          size: 12,
                          color: AppColors.gold,
                        ),
                        const SizedBox(width: 2),
                        Text(
                          listing.sellerRating.toString(),
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                            color: isDark
                                ? AppColors.textSecondaryDark
                                : const Color(0xFF64748B),
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          '• ${listing.bidsCount} bids',
                          style: TextStyle(
                            fontSize: 12,
                            color: isDark
                                ? AppColors.textTertiaryDark
                                : const Color(0xFF94A3B8),
                          ),
                        ),
                      ],
                    ),
                    const Spacer(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Current Bid',
                              style: TextStyle(
                                fontSize: 10,
                                color: isDark
                                    ? AppColors.textTertiaryDark
                                    : const Color(0xFF94A3B8),
                              ),
                            ),
                            Text(
                              '\$${listing.currentBid}',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: AppColors.gold,
                              ),
                            ),
                          ],
                        ),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppColors.gold.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: const Icon(
                            Icons.arrow_forward,
                            size: 16,
                            color: AppColors.gold,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    )
        .animate()
        .fadeIn(duration: AppTheme.durationNormal)
        .slideY(begin: 0.1, end: 0);
  }

  Widget _buildNavItem(IconData icon, String label, bool isActive) {
    return GestureDetector(
      onTap: () {},
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            icon,
            color: isActive ? AppColors.gold : AppColors.textTertiaryLight,
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.w500,
              color: isActive ? AppColors.gold : AppColors.textTertiaryLight,
            ),
          ),
        ],
      ),
    );
  }
}

class ListingItem {
  final String id;
  final String title;
  final int currentBid;
  final String imageUrl;
  final String timeLeft;
  final int bidsCount;
  final String sellerName;
  final double sellerRating;
  final bool isLive;

  const ListingItem({
    required this.id,
    required this.title,
    required this.currentBid,
    required this.imageUrl,
    required this.timeLeft,
    required this.bidsCount,
    required this.sellerName,
    required this.sellerRating,
    required this.isLive,
  });
}
