'use client';

import React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Search,
  Server,
  Sparkles,
  Video
} from 'lucide-react';

export default function About() {
  return (
    <div className='container mx-auto px-4 py-8 min-h-screen'>
      <motion.h1
        className='text-4xl font-bold mb-8 text-center text-primary'
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        About PhotoRAG
      </motion.h1>

      <motion.div
        className='mb-8 space-y-6'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {/* <Card>
          <CardHeader>
            <CardTitle className='text-2xl flex items-center'>
              <Video className='mr-2' /> Demo Video (Placeholder)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='aspect-w-16 aspect-h-9'>
              <iframe
                src='https://www.youtube.com/embed/-d8sNML3WT8?si=Jg8JRsGJ1xg3Cntr'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                className='w-full min-h-[400px] rounded-lg'
              ></iframe>
            </div>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Project Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              RAG Photo Search is an innovative image search application that
              leverages Azure AI and infrastructure to implement a
              Retrieval-Augmented Generation (RAG) system for photographs. This
              project showcases the power of combining vector embeddings,
              similarity search, and large language models to create an
              intelligent and efficient image retrieval system.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className='list-disc pl-6 space-y-2'>
              <li>Text-based image search with AI-refined queries</li>
              <li>Image-based similarity search</li>
              <li>Vector embeddings for efficient similarity comparisons</li>
              <li>
                Integration with Azure Cognitive Services and Azure OpenAI
              </li>
              <li>Scalable architecture using Azure infrastructure</li>
            </ul>
          </CardContent>
        </Card>

        <Accordion type='single' collapsible className='w-full'>
          <AccordionItem value='architecture'>
            <AccordionTrigger>
              <h3 className='text-xl font-semibold flex items-center'>
                <Server className='mr-2' /> Application Architecture
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-4'>
                <p>
                  The application is built using a modern, scalable
                  architecture:
                </p>
                <ul className='list-disc pl-6 space-y-2'>
                  <li>
                    <strong>Frontend:</strong> Next.js with React and Tailwind
                    CSS
                  </li>
                  <li>
                    <strong>Backend:</strong> Azure Functions for serverless API
                    endpoints
                  </li>
                  <li>
                    <strong>Database:</strong> Azure Cosmos DB for storing image
                    metadata and vector embeddings
                  </li>
                  <li>
                    <strong>Storage:</strong> Azure Blob Storage for storing
                    images
                  </li>
                  <li>
                    <strong>AI Services:</strong> Azure Cognitive Services
                    (Computer Vision) and Azure OpenAI
                  </li>
                </ul>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='search-process'>
            <AccordionTrigger>
              <h3 className='text-xl font-semibold flex items-center'>
                <Search className='mr-2' /> Search Process
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className='space-y-4'>
                <h4 className='text-lg font-semibold'>Text-based Search:</h4>
                <ol className='list-decimal pl-6 space-y-2'>
                  <li>User enters a text query</li>
                  <li>Query is refined using Azure OpenAI</li>
                  <li>Refined query is converted to a vector embedding</li>
                  <li>Similarity search is performed against the database</li>
                  <li>Further filtering is done by comparing tags of images</li>
                  <li>Results are ranked and returned to the user</li>
                </ol>
                <h4 className='text-lg font-semibold mt-4'>
                  Image-based Search:
                </h4>
                <ol className='list-decimal pl-6 space-y-2'>
                  <li>User uploads an image</li>
                  <li>Image is processed using Azure Computer Vision</li>
                  <li>Image features are converted to a vector embedding</li>
                  <li>Similarity search is performed against the database</li>
                  <li>Results are ranked and returned to the user</li>
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='technologies'>
            <AccordionTrigger>
              <h3 className='text-xl font-semibold flex items-center'>
                <Sparkles className='mr-2' /> Technologies Used
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                <Badge variant='outline' className='text-sm py-1 px-2'>
                  Next.js
                </Badge>
                <Badge variant='outline' className='text-sm py-1 px-2'>
                  React
                </Badge>
                <Badge variant='outline' className='text-sm py-1 px-2'>
                  Tailwind CSS
                </Badge>
                <Badge variant='outline' className='text-sm py-1 px-2'>
                  TypeScript
                </Badge>
                <Badge variant='outline' className='text-sm py-1 px-2'>
                  Azure Container App
                </Badge>
                <Badge variant='outline' className='text-sm py-1 px-2'>
                  Azure Postgresql
                </Badge>
                <Badge variant='outline' className='text-sm py-1 px-2'>
                  Azure Blob Storage
                </Badge>
                <Badge variant='outline' className='text-sm py-1 px-2'>
                  Azure Computer Vision
                </Badge>
                <Badge variant='outline' className='text-sm py-1 px-2'>
                  Azure OpenAI
                </Badge>
                <Badge variant='outline' className='text-sm py-1 px-2'>
                  Vector Embeddings
                </Badge>
                <Badge variant='outline' className='text-sm py-1 px-2'>
                  Similarity Search
                </Badge>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value='future-enhancements'>
            <AccordionTrigger>
              <h3 className='text-xl font-semibold flex items-center'>
                <ImageIcon className='mr-2' /> Future Enhancements
              </h3>
            </AccordionTrigger>
            <AccordionContent>
              <ul className='list-disc pl-6 space-y-2'>
                <li>
                  Implement user authentication and personalized search history
                </li>
                <li>
                  Add support for multi-modal queries (combining text and image
                  inputs)
                </li>
                <li>
                  Enhance the AI-refined query process with more advanced NLP
                  techniques
                </li>
                <li>
                  Implement image segmentation for more precise object-based
                  searches
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </motion.div>

      <motion.div
        className='mt-8'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Hackathon Submission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>
              This project is submitted as part of the Microsoft Hackathon,
              showcasing the potential of Azure AI and infrastructure in
              building advanced image search applications. We hope this
              demonstration inspires further innovations in the field of
              AI-powered media retrieval and analysis.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
