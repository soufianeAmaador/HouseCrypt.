import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadFilesComponent implements OnInit{

  @Output() filesUploaded = new EventEmitter<{photos: File[], videos: File[] }>()

  combinedMedia: File[] = [];
  // Arrays to store image and video files
  imageFiles: File[] = [];
  videoFiles: File[] = [];
  showNotification = false;
  notificationMessage = '';

  ngOnInit(): void {
    
  }

  constructor(){}

  removeFile(file: File) {

    this.combinedMedia = this.combinedMedia.filter(f => f !== file);
    file.type.startsWith('image/') ? this.imageFiles = this.imageFiles.filter(f => f !== file) : this.videoFiles = this.videoFiles.filter(f => f !== file); 
    this.showNotification = this.imageFiles.length > 10 && this.videoFiles.length > 5;
  }
    
  
  
  onFileChange(event: Event) {  
    const input = event.target as HTMLInputElement;
    let projectPhotos = this.imageFiles.length, projectVideos = this.videoFiles.length;
    let exceededLimit = false;
    
    if (input.files !== null && input.files!.length > 0) {
      const files = Array.from(input.files);
    
      // Loop through each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Check the MIME type of the file
        if (file.type.startsWith('image/') && projectPhotos < 10) {
          // It's an image
          this.imageFiles.push(file);
          projectPhotos++;
          exceededLimit = false;
        } else if (file.type.startsWith('video/') && projectVideos < 5) {
          // It's a video
          this.videoFiles.push(file);
          projectVideos++;
          exceededLimit = false;
        } else if((projectPhotos >= 10) || (projectVideos >= 5)){
          exceededLimit = true;
        }
        if (exceededLimit)
          this.notificationMessage = 'You have reached the maximum upload limit for either pictures (10) or videos (5).';
        
          this.showNotification = exceededLimit;
      }
      
      // Update combinedMedia to include newly uploaded files
      this.combinedMedia = [...this.imageFiles, ...this.videoFiles];

      this.filesUploaded.emit({ photos: this.imageFiles, videos: this.videoFiles });
    }

  }

  getCombinedMedia(): any[] {
    return this.combinedMedia;
  }

  
  getImageUrl(photo: File): string {
    return URL.createObjectURL(photo);
  }

  getVideoUrl(video: File): string {
    return URL.createObjectURL(video);
  }
}
