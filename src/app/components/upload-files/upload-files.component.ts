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

  ngOnInit(): void {
    
  }

  constructor(){}

  removeFile(file: any) {
    this.combinedMedia = this.combinedMedia.filter(f => f !== file);
  }
    
  
  
  onFileChange(event: Event) {  
    const input = event.target as HTMLInputElement;
    
    if (input.files !== null && input.files!.length > 0) {
      const files = Array.from(input.files);
  
      // Loop through each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Check the MIME type of the file
        if (file.type.startsWith('image/')) {
          // It's an image
          this.imageFiles.push(file);
        } else if (file.type.startsWith('video/')) {
          // It's a video
          this.videoFiles.push(file);
        }
              // Update combinedMedia to include newly uploaded files
      }

      this.combinedMedia = [...this.combinedMedia, ...files];

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
