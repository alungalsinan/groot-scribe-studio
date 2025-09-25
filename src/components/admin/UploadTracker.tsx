import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, User, FileText, Image, FileIcon } from 'lucide-react';
import { UploadLog } from '@/types';

interface UploadTrackerProps {
  uploads: UploadLog[];
}

export function UploadTracker({ uploads }: UploadTrackerProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4 text-blue-500" />;
      case 'pdf':
        return <FileText className="h-4 w-4 text-red-500" />;
      case 'article':
        return <FileText className="h-4 w-4 text-green-500" />;
      default:
        return <FileIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Upload History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {uploads.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No uploads yet</p>
          ) : (
            uploads.map((upload) => (
              <div key={upload.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {getFileIcon(upload.fileType)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{upload.fileName}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <User className="h-3 w-3" />
                      <span>{upload.uploadedBy.name}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{upload.uploadedAt.toLocaleString()}</span>
                      <span>•</span>
                      <span>{formatFileSize(upload.fileSize)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={upload.status === 'success' ? 'default' : 'destructive'}>
                    {upload.status}
                  </Badge>
                  <Badge variant="outline">
                    {upload.fileType}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}