package com.expensemanager.backend.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicSessionCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.UUID;

@Service
public class S3Service {

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.credentials.session-token}")
    private String sessionToken;

    @Value("${cloud.aws.region.static}")
    private String region;

    @Value("${cloud.aws.s3.bucket}")
    private String bucketName;

    private AmazonS3 s3Client;

    @PostConstruct
    public void init() {
        // Authenticate with AWS using the Academy Credentials
        BasicSessionCredentials creds = new BasicSessionCredentials(accessKey, secretKey, sessionToken);

        this.s3Client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(creds))
                .withRegion(region)
                .build();
    }

    public String uploadFile(MultipartFile file) {
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        File convertedFile = convertMultiPartToFile(file);

        try {
            // Upload to S3 and make it Publicly Readable
            s3Client.putObject(new PutObjectRequest(bucketName, fileName, convertedFile)
                    .withCannedAcl(CannedAccessControlList.PublicRead));

            // Return the URL
            return s3Client.getUrl(bucketName, fileName).toString();
        } catch (Exception e) {
            throw new RuntimeException("AWS Upload Failed: " + e.getMessage());
        } finally {
            convertedFile.delete(); // Cleanup temporary file
        }
    }

    private File convertMultiPartToFile(MultipartFile file) {
        File convFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            System.err.println("Error converting file: " + e.getMessage());
        }
        return convFile;
    }
}