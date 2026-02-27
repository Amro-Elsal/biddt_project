import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:go_router/go_router.dart';

import '../../../../config/theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final userId = FirebaseAuth.instance.currentUser?.uid;

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      body: StreamBuilder<DocumentSnapshot>(
        stream: FirebaseFirestore.instance
            .collection('users')
            .doc(userId)
            .snapshots(),
        builder: (context, snapshot) {
          if (!snapshot.hasData) {
            return const Center(child: CircularProgressIndicator());
          }

          final userData = snapshot.data!.data() as Map<String, dynamic>;

          return CustomScrollView(
            slivers: [
              // Header with avatar
              SliverToBoxAdapter(
                child: _buildHeader(context, userData),
              ),

              // Stats
              SliverToBoxAdapter(
                child: _buildStats(context, userData),
              ),

              // Badges
              SliverToBoxAdapter(
                child: _buildBadges(context, userData),
              ),

              // Menu Items
              SliverPadding(
                padding: const EdgeInsets.all(16),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    _buildMenuItem(
                      context,
                      'Buying Power',
                      Icons.account_balance_wallet_outlined,
                      AppColors.primary,
                      () => context.push('/wallet'),
                      subtitle: '\$${userData['buyingPower']?['total'] ?? 0}',
                    ),
                    _buildMenuItem(
                      context,
                      'My Listings',
                      Icons.inventory_2_outlined,
                      AppColors.accentCyan,
                      () => context.push('/seller/listings'),
                    ),
                    _buildMenuItem(
                      context,
                      'Seller Dashboard',
                      Icons.dashboard_outlined,
                      AppColors.accentGreen,
                      () => context.push('/seller/dashboard'),
                    ),
                    _buildMenuItem(
                      context,
                      'Edit Profile',
                      Icons.edit_outlined,
                      AppColors.textSecondary,
                      () => context.push('/profile/edit'),
                    ),
                    _buildMenuItem(
                      context,
                      'Notifications',
                      Icons.notifications_outlined,
                      AppColors.accentOrange,
                      () => context.push('/notifications'),
                    ),
                    _buildMenuItem(
                      context,
                      'Settings',
                      Icons.settings_outlined,
                      AppColors.textSecondary,
                      () {},
                    ),
                    _buildMenuItem(
                      context,
                      'Help & Support',
                      Icons.help_outline,
                      AppColors.textSecondary,
                      () {},
                    ),
                    const SizedBox(height: 24),
                    
                    // Sign Out Button
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: OutlinedButton(
                        onPressed: () async {
                          await FirebaseAuth.instance.signOut();
                          context.go('/');
                        },
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.accentRed,
                          side: const BorderSide(color: AppColors.accentRed),
                        ),
                        child: const Text('Sign Out'),
                      ),
                    ),
                  ]),
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildHeader(BuildContext context, Map<String, dynamic> userData) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [
            AppColors.bgElevated,
            AppColors.bgDark,
          ],
        ),
      ),
      child: Column(
        children: [
          // Settings gear
          Align(
            alignment: Alignment.topRight,
            child: IconButton(
              icon: const Icon(Icons.settings_outlined),
              onPressed: () {},
            ),
          ),
          
          // Avatar with verification badge
          Stack(
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: AppColors.primary,
                    width: 3,
                  ),
                ),
                child: CircleAvatar(
                  radius: 46,
                  backgroundImage: NetworkImage(userData['avatar'] ?? ''),
                  backgroundColor: AppColors.bgElevated,
                ),
              ),
              if (userData['verificationStatus'] == 'verified')
                Positioned(
                  bottom: 0,
                  right: 0,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: AppColors.accentGreen,
                      shape: BoxShape.circle,
                      border: Border.all(
                        color: AppColors.bgDark,
                        width: 2,
                      ),
                    ),
                    child: const Icon(
                      Icons.check,
                      color: Colors.white,
                      size: 16,
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 16),
          
          // Name
          Text(
            userData['displayName'] ?? 'User',
            style: Theme.of(context).textTheme.displaySmall?.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 4),
          
          // Username
          Text(
            '@${userData['username'] ?? 'username'}',
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
          const SizedBox(height: 16),
          
          // Trust Score
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(20),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(
                  Icons.star,
                  color: AppColors.primary,
                  size: 18,
                ),
                const SizedBox(width: 8),
                Text(
                  'Trust Score: ${userData['trustScore'] ?? 0}',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStats(BuildContext context, Map<String, dynamic> userData) {
    final stats = userData['stats'] as Map<String, dynamic>? ?? {};
    
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Row(
        children: [
          _buildStatItem(
            context,
            stats['transactions']?.toString() ?? '0',
            'Transactions',
          ),
          Container(
            width: 1,
            height: 40,
            color: AppColors.border,
          ),
          _buildStatItem(
            context,
            '${stats['responseRate'] ?? 0}%',
            'Response Rate',
          ),
          Container(
            width: 1,
            height: 40,
            color: AppColors.border,
          ),
          _buildStatItem(
            context,
            stats['responseTime']?.toString() ?? '< 1h',
            'Response Time',
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(BuildContext context, String value, String label) {
    return Expanded(
      child: Column(
        children: [
          Text(
            value,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w800,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppColors.textSecondary,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBadges(BuildContext context, Map<String, dynamic> userData) {
    final badges = userData['badges'] as List<dynamic>? ?? [];
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 24, 16, 12),
          child: Text(
            'Badges Earned',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w700,
            ),
          ),
        ),
        SizedBox(
          height: 100,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: badges.length,
            itemBuilder: (context, index) {
              return _buildBadgeItem(context, badges[index].toString());
            },
          ),
        ),
      ],
    );
  }

  Widget _buildBadgeItem(BuildContext context, String badge) {
    final badgeData = _getBadgeData(badge);
    
    return Container(
      width: 80,
      margin: const EdgeInsets.only(right: 12),
      child: Column(
        children: [
          Container(
            width: 60,
            height: 60,
            decoration: BoxDecoration(
              color: badgeData['color'].withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(
              badgeData['icon'],
              color: badgeData['color'],
              size: 28,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            badgeData['name'],
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppColors.textSecondary,
            ),
            textAlign: TextAlign.center,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Map<String, dynamic> _getBadgeData(String badge) {
    final badges = {
      'new_seller': {'name': 'New Seller', 'icon': Icons.person_outline, 'color': AppColors.accentCyan},
      'verified_id': {'name': 'Verified ID', 'icon': Icons.verified_user, 'color': AppColors.accentGreen},
      'quick_reply': {'name': 'Quick Reply', 'icon': Icons.speed, 'color': AppColors.accentOrange},
      'power_seller': {'name': 'Power Seller', 'icon': Icons.trending_up, 'color': AppColors.primary},
      'top_rated': {'name': 'Top Rated', 'icon': Icons.star, 'color': AppColors.primary},
    };
    
    return badges[badge] ?? {'name': badge, 'icon': Icons.emoji_events, 'color': AppColors.textSecondary};
  }

  Widget _buildMenuItem(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap, {
    String? subtitle,
  }) {
    return ListTile(
      onTap: onTap,
      leading: Container(
        padding: const EdgeInsets.all(10),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Icon(icon, color: color, size: 22),
      ),
      title: Text(
        title,
        style: Theme.of(context).textTheme.bodyLarge?.copyWith(
          color: AppColors.textPrimary,
          fontWeight: FontWeight.w600,
        ),
      ),
      subtitle: subtitle != null
          ? Text(
              subtitle,
              style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                color: AppColors.primary,
                fontWeight: FontWeight.w700,
              ),
            )
          : null,
      trailing: const Icon(
        Icons.arrow_forward_ios,
        color: AppColors.textTertiary,
        size: 16,
      ),
    );
  }
}
