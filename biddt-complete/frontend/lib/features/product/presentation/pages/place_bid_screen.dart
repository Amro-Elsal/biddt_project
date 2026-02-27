import 'package:flutter/material.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';

import '../../../../config/theme.dart';

class PlaceBidScreen extends StatefulWidget {
  final String listingId;

  const PlaceBidScreen({super.key, required this.listingId});

  @override
  State<PlaceBidScreen> createState() => _PlaceBidScreenState();
}

class _PlaceBidScreenState extends State<PlaceBidScreen> {
  final TextEditingController _bidController = TextEditingController();
  double _currentBid = 0;
  double _minimumBid = 0;
  Map<String, dynamic>? _listing;
  Map<String, dynamic>? _userData;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  @override
  void dispose() {
    _bidController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    final listingDoc = await FirebaseFirestore.instance
        .collection('listings')
        .doc(widget.listingId)
        .get();

    final userDoc = await FirebaseFirestore.instance
        .collection('users')
        .doc(FirebaseAuth.instance.currentUser?.uid)
        .get();

    setState(() {
      _listing = listingDoc.data();
      _currentBid = _listing?['currentBid']?.toDouble() ?? 0;
      _minimumBid = _currentBid + 5;
      _bidController.text = _minimumBid.toStringAsFixed(0);
      _userData = userDoc.data();
    });
  }

  void _setQuickBid(double amount) {
    setState(() {
      final newBid = _currentBid + amount;
      _bidController.text = newBid.toStringAsFixed(0);
    });
  }

  Future<void> _placeBid() async {
    final bidAmount = double.tryParse(_bidController.text) ?? 0;
    
    if (bidAmount < _minimumBid) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Bid must be at least \$${_minimumBid.toStringAsFixed(0)}'),
          backgroundColor: AppColors.accentRed,
        ),
      );
      return;
    }

    final userId = FirebaseAuth.instance.currentUser?.uid;
    if (userId == null) return;

    final depositAmount = bidAmount * 0.1;
    final availableBalance = _userData?['buyingPower']?['available']?.toDouble() ?? 0;

    if (availableBalance < depositAmount) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Insufficient buying power. Please top up your wallet.'),
          backgroundColor: AppColors.accentRed,
        ),
      );
      return;
    }

    try {
      // Create bid
      await FirebaseFirestore.instance.collection('bids').add({
        'listingId': widget.listingId,
        'bidderId': userId,
        'bidder': _userData,
        'amount': bidAmount,
        'depositAmount': depositAmount,
        'status': 'active',
        'createdAt': DateTime.now(),
      });

      // Update listing
      await FirebaseFirestore.instance
          .collection('listings')
          .doc(widget.listingId)
          .update({
        'currentBid': bidAmount,
        'bidCount': FieldValue.increment(1),
      });

      // Lock deposit
      await FirebaseFirestore.instance.collection('users').doc(userId).update({
        'buyingPower.locked': FieldValue.increment(depositAmount),
        'buyingPower.available': FieldValue.increment(-depositAmount),
      });

      // Create transaction
      await FirebaseFirestore.instance.collection('walletTransactions').add({
        'userId': userId,
        'type': 'bid_hold',
        'amount': -depositAmount,
        'description': 'Bid hold for "${_listing?['title']}"',
        'status': 'completed',
        'relatedListingId': widget.listingId,
        'createdAt': DateTime.now(),
      });

      if (mounted) {
        context.pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Bid placed successfully!'),
            backgroundColor: AppColors.accentGreen,
          ),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Error placing bid: $e'),
          backgroundColor: AppColors.accentRed,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_listing == null || _userData == null) {
      return const Scaffold(
        backgroundColor: AppColors.bgDark,
        body: Center(child: CircularProgressIndicator()),
      );
    }

    final bidAmount = double.tryParse(_bidController.text) ?? 0;
    final depositAmount = bidAmount * 0.1;
    final availableBalance = _userData?['buyingPower']?['available']?.toDouble() ?? 0;

    return Scaffold(
      backgroundColor: AppColors.bgDark,
      appBar: AppBar(
        title: const Text('Place Bid'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => context.pop(),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Item Summary
            _buildItemSummary(),
            const SizedBox(height: 24),

            // Your Bid Section
            Text(
              'Your Bid',
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(
                color: AppColors.textPrimary,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 16),

            // Bid Input
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.bgCard,
                borderRadius: BorderRadius.circular(16),
              ),
              child: Column(
                children: [
                  TextField(
                    controller: _bidController,
                    keyboardType: TextInputType.number,
                    style: Theme.of(context).textTheme.displayLarge?.copyWith(
                      color: AppColors.primary,
                      fontWeight: FontWeight.w700,
                    ),
                    decoration: InputDecoration(
                      prefixText: '\$ ',
                      prefixStyle: Theme.of(context).textTheme.displayMedium?.copyWith(
                        color: AppColors.primary,
                      ),
                      border: InputBorder.none,
                      contentPadding: EdgeInsets.zero,
                    ),
                    onChanged: (value) {
                      setState(() {});
                    },
                  ),
                  const SizedBox(height: 16),
                  
                  // Quick Bid Buttons
                  Row(
                    children: [
                      _buildQuickBidButton('+\$5', 5),
                      const SizedBox(width: 8),
                      _buildQuickBidButton('+\$10', 10),
                      const SizedBox(width: 8),
                      _buildQuickBidButton('+\$25', 25),
                      const SizedBox(width: 8),
                      _buildQuickBidButton('+\$50', 50),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),

            // Deposit Breakdown
            _buildDepositBreakdown(bidAmount, depositAmount),
            const SizedBox(height: 24),

            // Balance Check
            _buildBalanceCheck(availableBalance, depositAmount),
            const SizedBox(height: 32),

            // Place Bid Button
            SizedBox(
              width: double.infinity,
              height: 56,
              child: ElevatedButton(
                onPressed: availableBalance >= depositAmount ? _placeBid : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: availableBalance >= depositAmount
                      ? AppColors.primary
                      : AppColors.textTertiary,
                ),
                child: Text(
                  availableBalance >= depositAmount
                      ? 'Place Bid - Deposit \$${NumberFormat('#,##0.00').format(depositAmount)}'
                      : 'Insufficient Balance',
                  style: Theme.of(context).textTheme.labelLarge?.copyWith(
                    color: availableBalance >= depositAmount
                        ? AppColors.secondary
                        : Colors.white,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),

            // Security Note
            Row(
              children: [
                const Icon(
                  Icons.verified_user_outlined,
                  color: AppColors.accentGreen,
                  size: 18,
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Your deposit is held securely in escrow. If you are outbid, it will be refunded instantly.',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildItemSummary() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(12),
            child: Image.network(
              _listing?['images']?[0] ?? '',
              width: 80,
              height: 80,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  _listing?['title'] ?? '',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    color: AppColors.textPrimary,
                    fontWeight: FontWeight.w600,
                  ),
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                ),
                const SizedBox(height: 8),
                Text(
                  'Current Bid: \$${_currentBid.toStringAsFixed(0)}',
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

  Widget _buildQuickBidButton(String label, double amount) {
    return Expanded(
      child: GestureDetector(
        onTap: () => _setQuickBid(amount),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 12),
          decoration: BoxDecoration(
            color: AppColors.bgElevated,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: Theme.of(context).textTheme.bodyMedium?.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildDepositBreakdown(double bidAmount, double depositAmount) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.bgCard,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Deposit Breakdown',
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              color: AppColors.textPrimary,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 16),
          _buildBreakdownRow('Bid Amount', bidAmount),
          const SizedBox(height: 12),
          _buildBreakdownRow('Deposit Rate (10%)', depositAmount, isHighlight: true),
          const Divider(height: 24, color: AppColors.border),
          _buildBreakdownRow('Required Deposit', depositAmount, isTotal: true),
        ],
      ),
    );
  }

  Widget _buildBreakdownRow(String label, double amount, {bool isHighlight = false, bool isTotal = false}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
            color: isTotal ? AppColors.textPrimary : AppColors.textSecondary,
            fontWeight: isTotal ? FontWeight.w700 : FontWeight.w500,
          ),
        ),
        Text(
          '\$${NumberFormat('#,##0.00').format(amount)}',
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            color: isHighlight || isTotal ? AppColors.primary : AppColors.textPrimary,
            fontWeight: isTotal ? FontWeight.w800 : FontWeight.w600,
          ),
        ),
      ],
    );
  }

  Widget _buildBalanceCheck(double available, double required) {
    final isSufficient = available >= required;
    
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isSufficient
            ? AppColors.accentGreen.withOpacity(0.1)
            : AppColors.accentRed.withOpacity(0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isSufficient
              ? AppColors.accentGreen.withOpacity(0.3)
              : AppColors.accentRed.withOpacity(0.3),
        ),
      ),
      child: Row(
        children: [
          Icon(
            isSufficient ? Icons.check_circle : Icons.error,
            color: isSufficient ? AppColors.accentGreen : AppColors.accentRed,
            size: 24,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isSufficient ? 'Sufficient Balance' : 'Insufficient Balance',
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: isSufficient ? AppColors.accentGreen : AppColors.accentRed,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'Available: \$${NumberFormat('#,##0.00').format(available)}',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
