'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { UploadCloud, File, Download, Loader2, Upload } from 'lucide-react';
import Papa from 'papaparse';
import { writeBatch, collection, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { Progress } from './ui/progress';
import { Lead } from '@/lib/types';

const REQUIRED_HEADERS = ['Name', 'Phone', 'Email', 'Property Interest'];

export function BulkImportLeads() {
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = (files: FileList | null) => {
    if (files && files.length > 0) {
      if (files[0].type !== 'text/csv') {
        toast({
          variant: 'destructive',
          title: 'Invalid File Type',
          description: 'Please upload a valid CSV file.',
        });
        return;
      }
      setFile(files[0]);
    }
  };
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    handleFileChange(files);
  }, []);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const downloadSampleCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + REQUIRED_HEADERS.join(',') + "\n"
      + "John Doe,+1234567890,john.doe@example.com,Sunrise Apartments\n"
      + "Jane Smith,+9876543210,jane.smith@example.com,Ocean View Villas";
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_leads.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validatePhone = (phone: string) => {
    const digits = phone ? phone.replace(/\D/g, '') : '';
    return digits.length >= 10;
  };

  const handleImport = () => {
    if (!file) return;

    setIsParsing(true);
    Papa.parse<any>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        setIsParsing(false);
        const headers = results.meta.fields || [];
        const missingHeaders = REQUIRED_HEADERS.filter(h => !headers.includes(h));

        if (missingHeaders.length > 0) {
          toast({
            variant: "destructive",
            title: "CSV Header Mismatch",
            description: `Your file is missing required columns: ${missingHeaders.join(', ')}`,
          });
          return;
        }

        const validLeads = results.data.filter(row => {
          const name = row['Name']?.trim();
          const phone = row['Phone']?.trim();
          return name && phone && validatePhone(phone);
        });
        
        const invalidRowCount = results.data.length - validLeads.length;

        if (validLeads.length === 0) {
          toast({
            variant: "destructive",
            title: "No Valid Leads Found",
            description: "Please check your CSV file for leads with valid names and phone numbers.",
          });
          return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        try {
          const leadsCollection = collection(db, 'leads');
          const batch = writeBatch(db);
          const totalLeads = validLeads.length;

          validLeads.forEach((row, index) => {
            const leadDocRef = doc(leadsCollection);
            const newLeadData: Omit<Lead, 'id' | 'aiScore'> = {
              name: row['Name'],
              phone: row['Phone'],
              email: row['Email'] || '',
              propertyName: row['Property Interest'],
              source: 'Bulk Import',
              status: 'New',
              budget: 0,
              timestamp: serverTimestamp(),
            };
            batch.set(leadDocRef, newLeadData);

            if ((index + 1) % 10 === 0 || index + 1 === totalLeads) {
                setTimeout(() => setUploadProgress(Math.round(((index + 1) / totalLeads) * 100)), 0);
            }
          });

          await batch.commit();

          toast({
            title: "Import Successful",
            description: `${totalLeads} leads have been imported. ${invalidRowCount > 0 ? `${invalidRowCount} rows were skipped due to missing data.` : ''}`,
          });
          
          router.refresh();
          handleClose();

        } catch (error) {
          console.error("Error importing leads:", error);
          toast({
            variant: "destructive",
            title: "Import Failed",
            description: "An error occurred while uploading leads to the database.",
          });
        } finally {
          setIsUploading(false);
        }
      },
      error: (error) => {
        setIsParsing(false);
        toast({
          variant: 'destructive',
          title: 'Parsing Error',
          description: error.message,
        });
      },
    });
  };
  
  const handleClose = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Import
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => {
          if (isUploading || isParsing) {
            e.preventDefault();
          }
        }}>
            <DialogHeader>
            <DialogTitle>Bulk Import Leads</DialogTitle>
            <DialogDescription>
                Upload a CSV file to add multiple leads at once. Make sure your file matches the sample format.
            </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-6">
            <div 
                className="relative w-full h-48 border-2 border-dashed border-amber-500/50 rounded-xl flex flex-col items-center justify-center text-center p-4 transition-colors hover:bg-amber-500/10 hover:border-amber-500"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                {isUploading ? (
                <div className='w-full max-w-xs text-center'>
                    <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
                    <p className='font-semibold'>Uploading Leads...</p>
                    <Progress value={uploadProgress} className="mt-2" />
                    <p className='text-sm text-muted-foreground mt-1'>{uploadProgress}% complete</p>
                </div>
                ) : isParsing ? (
                <>
                    <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
                    <p className='font-semibold'>Parsing File...</p>
                    <p className='text-sm text-muted-foreground'>Please wait while we process your data.</p>
                </>
                ) : file ? (
                <div className="text-center">
                    <File className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-semibold text-foreground truncate">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
                    <Button variant="link" size="sm" className="mt-2 h-auto p-0" onClick={() => setFile(null)}>
                    Clear file
                    </Button>
                </div>
                ) : (
                <>
                    <UploadCloud className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="font-semibold text-foreground">Drag & drop your CSV here</p>
                    <p className="text-sm text-muted-foreground">or</p>
                    <label htmlFor="file-upload" className="mt-2 text-primary font-medium cursor-pointer hover:underline">
                    Click to select a file
                    </label>
                    <input id="file-upload" type="file" accept=".csv" className="sr-only" onChange={(e) => handleFileChange(e.target.files)} />
                </>
                )}
            </div>
            <div className="flex items-center justify-center">
                <Button variant="outline" size="sm" onClick={downloadSampleCsv}>
                <Download className="mr-2 h-4 w-4" />
                Download Sample CSV
                </Button>
            </div>
            </div>
            <DialogFooter>
            <Button variant="outline" onClick={handleClose} disabled={isUploading || isParsing}>Cancel</Button>
            <Button onClick={handleImport} disabled={!file || isUploading || isParsing}>
                {(isUploading || isParsing) ? 'Importing...' : 'Import Leads'}
            </Button>
            </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}