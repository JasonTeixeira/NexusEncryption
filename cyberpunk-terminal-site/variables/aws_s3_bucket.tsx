// AWS S3 Bucket configuration for file uploads and media storage
export const aws_s3_bucket = {
  bucketName: process.env.AWS_S3_BUCKET_NAME || "cyberpunk-portfolio-assets",
  region: process.env.AWS_REGION || "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  // Configuration options
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFileTypes: [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "application/pdf",
    "text/plain",
  ],

  // S3 bucket policies and settings
  publicRead: true,
  versioning: true,
  encryption: "AES256",

  // CDN and optimization
  cloudFrontDistribution: process.env.CLOUDFRONT_DISTRIBUTION_ID,
  optimizeImages: true,
  generateThumbnails: true,

  // Upload paths
  paths: {
    projects: "projects/",
    blog: "blog/",
    media: "media/",
    avatars: "avatars/",
    temp: "temp/",
  },
}

export default aws_s3_bucket
