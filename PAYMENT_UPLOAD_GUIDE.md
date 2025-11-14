# Enhanced Payment Proof Upload System

## Overview
The payment proof upload system has been significantly enhanced with modern features including drag-and-drop, live preview, progress tracking, and comprehensive validation.

## Features

### 1. Drag & Drop Upload
- **Intuitive Interface**: Simply drag your payment screenshot onto the upload area
- **Visual Feedback**: Upload zone highlights when dragging files over it
- **Click to Upload**: Traditional file selection still available

### 2. Live Image Preview
- **Instant Preview**: See your image before uploading
- **Image Details**: View file name, size, and format
- **Remove Option**: Easy removal if wrong file selected
- **Thumbnail Display**: Clear preview with proper sizing

### 3. File Validation
- **Size Limit**: Maximum 5MB per file
- **Format Check**: Supports JPEG, PNG, GIF, WebP
- **Real-time Validation**: Immediate feedback on invalid files
- **Clear Error Messages**: Specific guidance on what went wrong

### 4. Progress Tracking
- **Upload Progress**: Visual progress bar during upload
- **Status Updates**: Real-time status messages
- **Processing Indicator**: Shows when server is processing

### 5. Enhanced Security
- **File Type Validation**: Server-side verification
- **Filename Sanitization**: Secure file naming
- **Size Enforcement**: Strict size limits
- **Directory Creation**: Automatic upload directory setup

### 6. Better User Experience
- **Responsive Design**: Works on all devices
- **Toast Notifications**: Non-intrusive error messages
- **Modal Image Viewer**: Full-size image viewing
- **Download Option**: Download uploaded proofs
- **Status Indicators**: Clear verification status

## User Guide

### How to Upload Payment Proof

#### Method 1: Drag & Drop
1. Take a screenshot of your payment transaction
2. Go to **My Bookings** page
3. Find your pending booking
4. Drag your screenshot onto the upload area
5. Preview appears automatically
6. Enter reference number (optional)
7. Click **Upload Payment Proof**
8. Wait for confirmation

#### Method 2: Click to Upload
1. Go to **My Bookings** page
2. Find your pending booking
3. Click on the upload area
4. Select your payment screenshot
5. Preview appears automatically
6. Enter reference number (optional)
7. Click **Upload Payment Proof**
8. Wait for confirmation

### File Requirements

#### Supported Formats
- JPEG/JPG
- PNG
- GIF
- WebP

#### Size Limits
- Maximum: 5MB
- Recommended: 1-2MB for faster upload

#### Image Quality Tips
- Use clear, high-resolution screenshots
- Ensure transaction details are visible
- Include reference number in image
- Avoid blurry or dark images
- Crop unnecessary parts

### What to Include in Screenshot

#### Essential Information
- ✅ Transaction amount
- ✅ Date and time
- ✅ Reference/Transaction number
- ✅ Recipient name/account
- ✅ Payment status (Success/Completed)

#### Optional but Helpful
- Your account name
- Transaction ID
- Payment method logo
- Full transaction details

## Technical Details

### Upload Process Flow

```
1. User selects/drops file
   ↓
2. Client-side validation
   ↓
3. Preview generation
   ↓
4. User confirms upload
   ↓
5. File sent to server
   ↓
6. Server-side validation
   ↓
7. File saved to disk
   ↓
8. Database updated
   ↓
9. Activity logged
   ↓
10. User notified
```

### File Storage

**Location**: `/public/uploads/payments/`

**Naming Convention**: `payment-{timestamp}-{random}-{sanitized-name}.{ext}`

**Example**: `payment-1699999999999-123456789-gcash-screenshot.jpg`

### Security Measures

1. **File Type Validation**
   - MIME type checking
   - Extension verification
   - Double validation (client + server)

2. **Size Enforcement**
   - Client-side pre-check
   - Server-side hard limit
   - Clear error messages

3. **Filename Sanitization**
   - Remove special characters
   - Lowercase conversion
   - Unique timestamp prefix

4. **Directory Security**
   - Automatic creation
   - Proper permissions
   - Isolated storage

5. **Activity Logging**
   - Upload tracking
   - IP address logging
   - User agent capture
   - Timestamp recording

### Error Handling

#### Common Errors and Solutions

**Error**: "File size too large"
- **Solution**: Compress image or use lower resolution
- **Tip**: Use online image compressors

**Error**: "Only image files are allowed"
- **Solution**: Ensure file is JPEG, PNG, GIF, or WebP
- **Tip**: Convert PDF/document to image first

**Error**: "Please select an image file"
- **Solution**: File input is empty, select a file
- **Tip**: Try drag & drop instead

**Error**: "Booking not found"
- **Solution**: Verify booking exists and belongs to you
- **Tip**: Refresh page and try again

**Error**: "Payment proof can only be uploaded for pending bookings"
- **Solution**: Booking already confirmed or cancelled
- **Tip**: Contact support if needed

### API Endpoints

#### Upload Payment Proof
```
POST /bookings/:id/payment
Content-Type: multipart/form-data

Parameters:
- paymentProof: File (required)
- referenceNumber: String (optional)

Response:
- Success: Redirect to /bookings with success message
- Error: Redirect to /bookings with error message
```

### Database Schema

#### Booking Model Updates
```javascript
{
  paymentProof: String,        // File path
  referenceNumber: String,     // Transaction reference
  status: Enum,                // pending_verification after upload
  updatedAt: DateTime          // Auto-updated
}
```

#### Activity Log Entry
```javascript
{
  userId: Integer,
  action: 'upload',
  entity: 'payment_proof',
  entityId: Integer,           // Booking ID
  description: String,         // Upload details
  ipAddress: String,
  userAgent: String,
  createdAt: DateTime
}
```

## Admin Features

### Payment Verification Workflow

1. **View Pending Verifications**
   - Go to Admin Bookings
   - Filter by "Pending Verification"
   - See all uploaded payment proofs

2. **Review Payment Proof**
   - Click thumbnail to view full size
   - Check transaction details
   - Verify amount matches booking
   - Confirm reference number

3. **Approve or Reject**
   - Click "Confirm Booking" if valid
   - Click "Cancel Booking" if invalid
   - Customer receives notification

### Admin View Enhancements

- **Thumbnail Preview**: Quick view in booking list
- **Full-Size Modal**: Click to enlarge
- **Download Option**: Save proof for records
- **Reference Display**: Easy reference number viewing
- **Status Indicators**: Clear verification status

## Performance Optimization

### Client-Side
- Lazy loading for images
- Progressive enhancement
- Async file reading
- Efficient preview generation

### Server-Side
- Stream-based file handling
- Efficient disk I/O
- Optimized database queries
- Minimal memory usage

## Browser Compatibility

### Fully Supported
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Partially Supported
- Chrome 80-89 (no drag & drop)
- Firefox 78-87 (no drag & drop)
- Safari 13 (no drag & drop)

### Not Supported
- Internet Explorer (any version)
- Chrome < 80
- Firefox < 78

## Troubleshooting

### Upload Not Working

**Check:**
1. File size under 5MB
2. File is an image format
3. Internet connection stable
4. Browser is supported
5. JavaScript enabled

**Try:**
1. Refresh the page
2. Clear browser cache
3. Try different browser
4. Compress the image
5. Use different file format

### Preview Not Showing

**Check:**
1. File is valid image
2. Browser supports FileReader API
3. JavaScript not blocked
4. No console errors

**Try:**
1. Reload the page
2. Try different file
3. Update browser
4. Disable extensions

### Upload Stuck at Processing

**Check:**
1. Internet connection
2. Server status
3. File size reasonable

**Try:**
1. Wait 30 seconds
2. Refresh and retry
3. Use smaller file
4. Contact support

## Best Practices

### For Users
1. Upload immediately after payment
2. Use clear, readable screenshots
3. Include all transaction details
4. Keep original receipt
5. Note reference number

### For Administrators
1. Verify within 24 hours
2. Check all details carefully
3. Keep records of verifications
4. Communicate with customers
5. Document rejections

## Future Enhancements

### Planned Features
- [ ] Image compression before upload
- [ ] Multiple file upload
- [ ] OCR for automatic reference extraction
- [ ] Direct payment gateway integration
- [ ] Email notifications with proof
- [ ] SMS confirmation
- [ ] Mobile app support
- [ ] Automatic verification for known accounts

## Support

### Need Help?
- **Email**: info@balatasan-resort.com
- **Phone**: +63 917 123 4567
- **Hours**: 24/7 Support

### Report Issues
- Technical problems: Report via contact form
- Upload errors: Include error message
- Payment issues: Contact immediately

## Version History

### Version 2.0.0 (Current)
- ✅ Drag & drop upload
- ✅ Live image preview
- ✅ Progress tracking
- ✅ Enhanced validation
- ✅ Modal image viewer
- ✅ Better error handling
- ✅ Activity logging
- ✅ Security improvements

### Version 1.0.0
- Basic file upload
- Simple validation
- Database storage

---

**Last Updated**: November 14, 2025
**Documentation Version**: 2.0.0
