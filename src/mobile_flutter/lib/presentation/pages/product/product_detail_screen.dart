import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/app_theme.dart';

/// Product Detail Screen
/// Design from Stitch: product_detail_light_mode
class ProductDetailScreen extends StatefulWidget {
  const ProductDetailScreen({super.key});

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  final List<String> _images = [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600',
  ];
  int _currentImageIndex = 0;

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final backgroundColor =
        isDark ? AppColors.backgroundDark : const Color(0xFFF8F8F5);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: CustomScrollView(
        slivers: [
          // App Bar with Image
          SliverAppBar(
            expandedHeight: 400,
            pinned: true,
            backgroundColor: Colors.transparent,
            elevation: 0,
            leading: Container(
              margin: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.black.withOpacity(0.3),
                shape: BoxShape.circle,
              ),
              child: IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white),
                onPressed: () => Navigator.pop(context),
              ),
            ),
            actions: [
              Container(
                margin: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.3),
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  icon: const Icon(Icons.favorite_border, color: Colors.white),
                  onPressed: () {},
                ),
              ),
              Container(
                margin: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: Colors.black.withOpacity(0.3),
                  shape: BoxShape.circle,
                ),
                child: IconButton(
                  icon: const Icon(Icons.share, color: Colors.white),
                  onPressed: () {},
                ),
              ),
            ],
            flexibleSpace: FlexibleSpaceBar(
              background: Stack(
                children: [
                  // Main image
                  PageView.builder(
                    onPageChanged: (index) =>
                        setState(() => _currentImageIndex = index),
                    itemCount: _images.length,
                    itemBuilder: (context, index) {
                      return Image.network(
                        _images[index],
                        fit: BoxFit.cover,
                      );
                    },
                  ),

                  // Image indicators
                  Positioned(
                    bottom: 16,
                    left: 0,
                    right: 0,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: List.generate(
                        _images.length,
                        (index) => AnimatedContainer(
                          duration: AppTheme.durationFast,
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          width: _currentImageIndex == index ? 24 : 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: _currentImageIndex == index
                                ? AppColors.gold
                                : Colors.white.withOpacity(0.5),
                            borderRadius: BorderRadius.circular(4),
                          ),
                        ),
                      ),
                    ),
                  ),

                  // Live badge
                  Positioned(
                    top: 100,
                    left: 16,
                    child: Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 12,
                        vertical: 6,
                      ),
                      decoration: BoxDecoration(
                        color: AppColors.error,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Row(
                        children: [
                          Container(
                            width: 8,
                            height: 8,
                            decoration: const BoxDecoration(
                              color: Colors.white,
                              shape: BoxShape.circle,
                            ),
                          )
                              .animate(
                                  onPlay: (controller) => controller.repeat())
                              .fadeOut(duration: 800.ms)
                              .fadeIn(duration: 800.ms),
                          const SizedBox(width: 6),
                          const Text(
                            'LIVE AUCTION',
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Content
          SliverToBoxAdapter(
            child: Container(
              decoration: BoxDecoration(
                color: isDark ? AppColors.surfaceDark : Colors.white,
                borderRadius: const BorderRadius.vertical(
                  top: Radius.circular(24),
                ),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Title and price row
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Vintage Film Camera',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.w700,
                                  color: isDark
                                      ? AppColors.textPrimaryDark
                                      : const Color(0xFF181710),
                                ),
                              ),
                              const SizedBox(height: 8),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 8,
                                      vertical: 4,
                                    ),
                                    decoration: BoxDecoration(
                                      color: AppColors.success.withOpacity(0.1),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: const Row(
                                      children: [
                                        Icon(
                                          Icons.verified,
                                          size: 14,
                                          color: AppColors.success,
                                        ),
                                        SizedBox(width: 4),
                                        Text(
                                          'Verified Seller',
                                          style: TextStyle(
                                            fontSize: 12,
                                            fontWeight: FontWeight.w600,
                                            color: AppColors.success,
                                          ),
                                        ),
                                      ],
                                    ),
                                  ),
                                  const SizedBox(width: 8),
                                  Text(
                                    '12 bids',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: isDark
                                          ? AppColors.textSecondaryDark
                                          : const Color(0xFF64748B),
                                    ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              'Current Bid',
                              style: TextStyle(
                                fontSize: 12,
                                color: isDark
                                    ? AppColors.textTertiaryDark
                                    : const Color(0xFF94A3B8),
                              ),
                            ),
                            const Text(
                              '\$245',
                              style: TextStyle(
                                fontSize: 32,
                                fontWeight: FontWeight.w800,
                                color: AppColors.gold,
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),

                    const SizedBox(height: 24),

                    // Countdown timer
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDark
                            ? AppColors.backgroundDark
                            : const Color(0xFFF8F8F5),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                        children: [
                          _buildTimeUnit('02', 'Hours'),
                          const Text(
                            ':',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.w700,
                              color: AppColors.gold,
                            ),
                          ),
                          _buildTimeUnit('15', 'Mins'),
                          const Text(
                            ':',
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.w700,
                              color: AppColors.gold,
                            ),
                          ),
                          _buildTimeUnit('42', 'Secs'),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Seller info
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDark
                            ? AppColors.backgroundDark
                            : const Color(0xFFF8F8F5),
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        children: [
                          CircleAvatar(
                            radius: 28,
                            backgroundImage: NetworkImage(
                              'https://i.pravatar.cc/150?img=32',
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Sarah Mitchell',
                                  style: TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.w600,
                                    color: isDark
                                        ? AppColors.textPrimaryDark
                                        : const Color(0xFF181710),
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    const Icon(
                                      Icons.star,
                                      size: 14,
                                      color: AppColors.gold,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      '4.8',
                                      style: TextStyle(
                                        fontSize: 14,
                                        fontWeight: FontWeight.w600,
                                        color: isDark
                                            ? AppColors.textSecondaryDark
                                            : const Color(0xFF64748B),
                                      ),
                                    ),
                                    const SizedBox(width: 8),
                                    Text(
                                      '• 24 sales',
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: isDark
                                            ? AppColors.textTertiaryDark
                                            : const Color(0xFF94A3B8),
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          ElevatedButton(
                            onPressed: () {},
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.gold,
                              foregroundColor: const Color(0xFF181710),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: const Text('Contact'),
                          ),
                        ],
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Description
                    Text(
                      'Description',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: isDark
                            ? AppColors.textPrimaryDark
                            : const Color(0xFF181710),
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Beautiful vintage film camera in excellent condition. Fully functional with original leather case. Perfect for collectors or photography enthusiasts. Comes with 3 rolls of film.',
                      style: TextStyle(
                        fontSize: 14,
                        height: 1.6,
                        color: isDark
                            ? AppColors.textSecondaryDark
                            : const Color(0xFF64748B),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Item details
                    Text(
                      'Item Details',
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                        color: isDark
                            ? AppColors.textPrimaryDark
                            : const Color(0xFF181710),
                      ),
                    ),
                    const SizedBox(height: 12),
                    _buildDetailRow('Condition', 'Excellent'),
                    _buildDetailRow('Category', 'Electronics'),
                    _buildDetailRow('Location', 'Halifax, NS'),
                    _buildDetailRow('Posted', '2 days ago'),

                    const SizedBox(height: 100),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),

      // Bottom action bar
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: isDark ? AppColors.surfaceDark : Colors.white,
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 20,
              offset: const Offset(0, -10),
            ),
          ],
        ),
        child: SafeArea(
          child: Row(
            children: [
              // Quick bid buttons
              Expanded(
                child: Row(
                  children: [
                    Expanded(
                      child: _buildQuickBidButton('+\$5', isDark),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildQuickBidButton('+\$10', isDark),
                    ),
                    const SizedBox(width: 8),
                    Expanded(
                      child: _buildQuickBidButton('+\$25', isDark),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              // Place bid button
              Expanded(
                child: SizedBox(
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () {},
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.gold,
                      foregroundColor: const Color(0xFF181710),
                      elevation: 4,
                      shadowColor: AppColors.gold.withOpacity(0.3),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    child: const Text(
                      'Place Bid',
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ),
                )
                    .animate()
                    .scale(duration: AppTheme.durationNormal),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTimeUnit(String value, String label) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          decoration: BoxDecoration(
            color: AppColors.gold.withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Text(
            value,
            style: const TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w800,
              color: AppColors.gold,
            ),
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 12,
            color: AppColors.textTertiaryLight,
          ),
        ),
      ],
    );
  }

  Widget _buildDetailRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 14,
              color: AppColors.textTertiaryLight,
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: Color(0xFF181710),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickBidButton(String amount, bool isDark) {
    return Container(
      height: 44,
      decoration: BoxDecoration(
        color: isDark ? AppColors.backgroundDark : const Color(0xFFF8F8F5),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: AppColors.gold.withOpacity(0.3),
        ),
      ),
      child: Center(
        child: Text(
          amount,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: AppColors.gold,
          ),
        ),
      ),
    );
  }
}
