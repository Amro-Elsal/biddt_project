import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../../core/constants/app_colors.dart';
import '../../../core/theme/app_theme.dart';

/// Phone Authentication Screen
/// Design from Stitch: verification_pending_light_mode
class PhoneAuthScreen extends StatefulWidget {
  const PhoneAuthScreen({super.key});

  @override
  State<PhoneAuthScreen> createState() => _PhoneAuthScreenState();
}

class _PhoneAuthScreenState extends State<PhoneAuthScreen> {
  final _phoneController = TextEditingController();
  final _otpController = TextEditingController();
  bool _isLoading = false;
  bool _otpSent = false;
  int _resendTimer = 60;

  @override
  void dispose() {
    _phoneController.dispose();
    _otpController.dispose();
    super.dispose();
  }

  void _sendOTP() {
    setState(() {
      _isLoading = true;
    });

    // Simulate API call
    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        _isLoading = false;
        _otpSent = true;
      });
      _startResendTimer();
    });
  }

  void _verifyOTP() {
    setState(() {
      _isLoading = true;
    });

    // Simulate verification
    Future.delayed(const Duration(seconds: 2), () {
      setState(() {
        _isLoading = false;
      });
      // Navigate to profile setup
    });
  }

  void _startResendTimer() {
    Future.delayed(const Duration(seconds: 1), () {
      if (mounted && _resendTimer > 0) {
        setState(() {
          _resendTimer--;
        });
        _startResendTimer();
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final backgroundColor =
        isDark ? AppColors.backgroundDark : const Color(0xFFF8F8F5);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          icon: Icon(
            Icons.arrow_back,
            color: isDark ? AppColors.textPrimaryDark : const Color(0xFF181710),
          ),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title
              Text(
                _otpSent ? 'Verify Code' : 'Enter Phone',
                style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.w800,
                  color: isDark
                      ? AppColors.textPrimaryDark
                      : const Color(0xFF181710),
                ),
              ),

              const SizedBox(height: 8),

              // Subtitle
              Text(
                _otpSent
                    ? 'Enter the 6-digit code sent to ${_phoneController.text}'
                    : 'We\'ll send you a verification code to get started',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w500,
                  color: isDark
                      ? AppColors.textSecondaryDark
                      : const Color(0xFF64748B),
                ),
              ),

              const SizedBox(height: 48),

              if (!_otpSent) ...[
                // Phone input
                Container(
                  decoration: BoxDecoration(
                    color: isDark
                        ? AppColors.surfaceDark
                        : const Color(0xFFE7E5DA),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: Row(
                    children: [
                      // Country code
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 20,
                        ),
                        child: Row(
                          children: [
                            Text(
                              '🇨🇦',
                              style: const TextStyle(fontSize: 20),
                            ),
                            const SizedBox(width: 8),
                            Text(
                              '+1',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w600,
                                color: isDark
                                    ? AppColors.textPrimaryDark
                                    : const Color(0xFF181710),
                              ),
                            ),
                            Icon(
                              Icons.keyboard_arrow_down,
                              color: isDark
                                  ? AppColors.textSecondaryDark
                                  : const Color(0xFF64748B),
                            ),
                          ],
                        ),
                      ),

                      // Divider
                      Container(
                        width: 1,
                        height: 24,
                        color: isDark
                            ? AppColors.surfaceVariantDark
                            : const Color(0xFFD1CFC4),
                      ),

                      // Phone number
                      Expanded(
                        child: TextField(
                          controller: _phoneController,
                          keyboardType: TextInputType.phone,
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w600,
                            color: isDark
                                ? AppColors.textPrimaryDark
                                : const Color(0xFF181710),
                          ),
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                            LengthLimitingTextInputFormatter(10),
                          ],
                          decoration: InputDecoration(
                            hintText: '(902) 555-0123',
                            hintStyle: TextStyle(
                              color: isDark
                                  ? AppColors.textTertiaryDark
                                  : const Color(0xFF94A3B8),
                            ),
                            border: InputBorder.none,
                            contentPadding: const EdgeInsets.symmetric(
                              horizontal: 16,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ] else ...[
                // OTP input
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: List.generate(
                    6,
                    (index) => Container(
                      width: 48,
                      height: 56,
                      decoration: BoxDecoration(
                        color: isDark
                            ? AppColors.surfaceDark
                            : const Color(0xFFE7E5DA),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Center(
                        child: TextField(
                          controller: index == 0 ? _otpController : null,
                          textAlign: TextAlign.center,
                          keyboardType: TextInputType.number,
                          maxLength: 1,
                          style: TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.w700,
                            color: isDark
                                ? AppColors.textPrimaryDark
                                : const Color(0xFF181710),
                          ),
                          decoration: const InputDecoration(
                            counterText: '',
                            border: InputBorder.none,
                          ),
                          onChanged: (value) {
                            if (value.length == 1 && index < 5) {
                              FocusScope.of(context).nextFocus();
                            }
                          },
                        ),
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 24),

                // Resend timer
                Center(
                  child: TextButton(
                    onPressed: _resendTimer == 0 ? _sendOTP : null,
                    child: Text(
                      _resendTimer > 0
                          ? 'Resend code in ${_resendTimer}s'
                          : 'Resend code',
                      style: TextStyle(
                        color: _resendTimer > 0
                            ? isDark
                                ? AppColors.textTertiaryDark
                                : const Color(0xFF94A3B8)
                            : AppColors.primary,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ),
                ),
              ],

              const Spacer(),

              // Continue button
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: _isLoading
                      ? null
                      : _otpSent
                          ? _verifyOTP
                          : _sendOTP,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.gold,
                    foregroundColor: const Color(0xFF181710),
                    elevation: 4,
                    shadowColor: AppColors.gold.withOpacity(0.3),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    disabledBackgroundColor: AppColors.gold.withOpacity(0.5),
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            valueColor: AlwaysStoppedAnimation(
                              Color(0xFF181710),
                            ),
                          ),
                        )
                      : Text(
                          _otpSent ? 'Verify' : 'Continue',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
