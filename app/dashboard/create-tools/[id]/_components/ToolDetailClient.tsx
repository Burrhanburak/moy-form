'use client';

import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface ToolDetailClientProps {
  tool: {
    id: string;
    name: string;
    price: number;
    description: string;
    features: string[];
    optionalAddons: string[];
    maintenanceRequired: boolean;
    maintenancePrice: string;
    automationType?: string | null;
    triggerType?: string | null;
    integrations: string[];
    complexity?: string | null;
    executionFrequency?: string | null;
    dataVolume?: string | null;
    customRequirements?: string | null;
    apiConnections?: number | null;
    webhookEndpoints?: number | null;
    dataTransformations?: number | null;
    errorHandling: boolean;
    monitoring: boolean;
    backupStrategy?: string | null;
    documentation?: string | null;
    trainingIncluded: boolean;
    supportLevel?: string | null;
    technicalNotes?: string | null;
    testingIncluded: boolean;
    deploymentType?: string | null;
    scalabilityOptions?: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
}

export default function ToolDetailClient({ tool }: ToolDetailClientProps) {
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount);
  };

  return (
    <div className="flex h-full w-full flex-row gap-x-2 p-4">
      <div className="flex w-full flex-col items-center rounded-2xl border border-gray-200 bg-white px-4 md:overflow-y-auto md:border md:bg-white md:px-8 dark:border-[#131313] dark:bg-[#17191a]">
        <div className="flex h-full w-full flex-col max-w-7xl">
          <div className="flex w-full flex-col gap-y-4 py-8 md:flex-row md:items-center md:justify-between">
            <h4 className="text-xl font-medium text-gray-900 dark:text-white">
              <div className="flex flex-col gap-4">
                <div className="flex flex-row items-center gap-4">
                  <h2 className="text-lg font-medium">Tool</h2>
                  <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Active
                  </Badge>
                </div>
              </div>
            </h4>
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard/benefits/create-tools"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Tools
              </Link>
              <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetTrigger asChild>
                  <button className="flex items-center justify-center rounded-xl border border-white/10 bg-[#171719] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-0 focus:ring-offset-0">
                    <div className="flex flex-row items-center">Edit Tool</div>
                  </button>
                </SheetTrigger>
                <SheetContent 
                  className="p-0 rounded-3xl mr-2 ml-2 md:mr-4 md:ml-4 sheet-content z-50" 
                  style={{ 
                    height: 'calc(100vh - 1rem)',
                    top: '0.5rem',
                    maxHeight: 'calc(100vh - 1rem)',
                    width: 'calc(100vw - 1rem)',
                    maxWidth: '600px',
                    zIndex: 50
                  }}
                >
                  <div className="p-8 h-full flex flex-col">
                    <SheetHeader className="mb-6 flex-shrink-0">
                      <SheetTitle>Edit Tool</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)] pr-3 flex-1 relative z-10">
                      <form>
                        {/* Basic Info */}
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Temel Bilgiler</h3>
                        <div className="space-y-4">
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Tool Adı</label>
                            <input 
                              name="name"
                              type="text" 
                              defaultValue={tool.name}
                              placeholder="Örn: E-ticaret Otomasyonu"
                              className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              required
                            />
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Açıklama</label>
                            <textarea 
                              name="description"
                              defaultValue={tool.description}
                              placeholder="Tool hakkında detaylı açıklama..."
                              className="w-full p-3 border rounded-xl h-24 dark:bg-[#171719] dark:border-white/10"
                              required
                            />
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Fiyat (₺)</label>
                            <input 
                              name="price"
                              type="number" 
                              defaultValue={tool.price}
                              placeholder="Örn: 5000"
                              min="1"
                              className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              required
                            />
                          </div>
                        </div>

                        {/* n8n Automation Details */}
                        <div className="space-y-4 pt-4 border-t dark:border-white/10">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">n8n Otomasyon Detayları</h3>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium">Otomasyon Türü</label>
                              <select 
                                name="automationType"
                                defaultValue={tool.automationType || ""}
                                className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              >
                                <option value="">Seçiniz</option>
                                <option value="workflow">Workflow</option>
                                <option value="integration">Integration</option>
                                <option value="data-processing">Data Processing</option>
                                <option value="notification">Notification</option>
                                <option value="custom">Custom</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium">Trigger Türü</label>
                              <select 
                                name="triggerType"
                                defaultValue={tool.triggerType || ""}
                                className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              >
                                <option value="">Seçiniz</option>
                                <option value="webhook">Webhook</option>
                                <option value="schedule">Schedule</option>
                                <option value="manual">Manual</option>
                                <option value="event-based">Event-based</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium">Karmaşıklık</label>
                              <select 
                                name="complexity"
                                defaultValue={tool.complexity || ""}
                                className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              >
                                <option value="">Seçiniz</option>
                                <option value="simple">Simple</option>
                                <option value="medium">Medium</option>
                                <option value="complex">Complex</option>
                                <option value="enterprise">Enterprise</option>
                              </select>
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium">Çalışma Sıklığı</label>
                              <select 
                                name="executionFrequency"
                                defaultValue={tool.executionFrequency || ""}
                                className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              >
                                <option value="">Seçiniz</option>
                                <option value="real-time">Real-time</option>
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="on-demand">On-demand</option>
                              </select>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Veri Hacmi</label>
                            <select 
                              name="dataVolume"
                              defaultValue={tool.dataVolume || ""}
                              className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                            >
                              <option value="">Seçiniz</option>
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                              <option value="enterprise">Enterprise</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Deployment Türü</label>
                            <select 
                              name="deploymentType"
                              defaultValue={tool.deploymentType || ""}
                              className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                            >
                              <option value="">Seçiniz</option>
                              <option value="cloud">Cloud</option>
                              <option value="on-premise">On-premise</option>
                              <option value="hybrid">Hybrid</option>
                            </select>
                          </div>
                        </div>

                        {/* Integrations & Technical Details */}
                        <div className="space-y-4 pt-4 border-t dark:border-white/10">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Entegrasyonlar ve Teknik Detaylar</h3>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Entegrasyonlar</label>
                            <textarea 
                              name="integrations"
                              defaultValue={tool.integrations.join('\n')}
                              placeholder="Her satıra bir entegrasyon yazın&#10;slack&#10;google-sheets&#10;zapier&#10;api"
                              className="w-full p-3 border rounded-xl h-20 text-sm dark:bg-[#171719] dark:border-white/10"
                            />
                            <p className="text-xs text-gray-500">Kullanılacak entegrasyonları listeleyin</p>
                          </div>

                          <div className="grid grid-cols-3 gap-3">
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium">API Bağlantıları</label>
                              <input 
                                name="apiConnections"
                                type="number" 
                                defaultValue={tool.apiConnections || ""}
                                placeholder="5"
                                min="0"
                                className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium">Webhook Endpoint&apos;leri</label>
                              <input 
                                name="webhookEndpoints"
                                type="number" 
                                defaultValue={tool.webhookEndpoints || ""}
                                placeholder="3"
                                min="0"
                                className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              />
                            </div>
                            <div className="flex flex-col gap-2">
                              <label className="text-sm font-medium">Veri Dönüşümleri</label>
                              <input 
                                name="dataTransformations"
                                type="number" 
                                defaultValue={tool.dataTransformations || ""}
                                placeholder="10"
                                min="0"
                                className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Özel Gereksinimler</label>
                            <textarea 
                              name="customRequirements"
                              defaultValue={tool.customRequirements || ""}
                              placeholder="Özel gereksinimlerinizi buraya yazın..."
                              className="w-full p-3 border rounded-xl h-20 dark:bg-[#171719] dark:border-white/10"
                            />
                          </div>
                        </div>

                        {/* Features & Services */}
                        <div className="space-y-4 pt-4 border-t dark:border-white/10">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Özellikler ve Hizmetler</h3>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Özellikler</label>
                            <textarea 
                              name="features"
                              defaultValue={tool.features.join('\n')}
                              placeholder="Her satıra bir özellik yazın&#10;- Otomatik veri senkronizasyonu&#10;- Hata yönetimi&#10;- Monitoring"
                              className="w-full p-3 border rounded-xl h-24 dark:bg-[#171719] dark:border-white/10"
                              required
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Opsiyonel Eklentiler</label>
                            <textarea 
                              name="optionalAddons"
                              defaultValue={tool.optionalAddons.join('\n')}
                              placeholder="Her satıra bir eklenti yazın&#10;- Gelişmiş monitoring&#10;- Backup sistemi&#10;- Çoklu dil desteği"
                              className="w-full p-3 border rounded-xl h-24 dark:bg-[#171719] dark:border-white/10"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10">
                              <input 
                                name="errorHandling"
                                type="checkbox" 
                                id="errorHandling"
                                defaultChecked={tool.errorHandling}
                                className="w-4 h-4"
                                value="true"
                              />
                              <label htmlFor="errorHandling" className="text-sm font-medium">Hata yönetimi</label>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10">
                              <input 
                                name="monitoring"
                                type="checkbox" 
                                id="monitoring"
                                defaultChecked={tool.monitoring}
                                className="w-4 h-4"
                                value="true"
                              />
                              <label htmlFor="monitoring" className="text-sm font-medium">Monitoring</label>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10">
                              <input 
                                name="testingIncluded"
                                type="checkbox" 
                                id="testingIncluded"
                                defaultChecked={tool.testingIncluded}
                                className="w-4 h-4"
                                value="true"
                              />
                              <label htmlFor="testingIncluded" className="text-sm font-medium">Test dahil</label>
                            </div>
                            <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10">
                              <input 
                                name="trainingIncluded"
                                type="checkbox" 
                                id="trainingIncluded"
                                defaultChecked={tool.trainingIncluded}
                                className="w-4 h-4"
                                value="true"
                              />
                              <label htmlFor="trainingIncluded" className="text-sm font-medium">Eğitim dahil</label>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 p-3 border rounded-xl dark:border-white/10">
                            <input 
                              name="maintenanceRequired"
                              type="checkbox" 
                              id="maintenance"
                              defaultChecked={tool.maintenanceRequired}
                              className="w-4 h-4"
                              value="true"
                            />
                            <label htmlFor="maintenance" className="text-sm font-medium">Aylık bakım gerekli</label>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Aylık Bakım Ücreti (₺)</label>
                            <input 
                              name="maintenancePrice"
                              type="text" 
                              defaultValue={tool.maintenancePrice}
                              placeholder="Örn: 500"
                              className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                            />
                          </div>
                        </div>

                        {/* Technical Notes & Support */}
                        <div className="space-y-4 pt-4 border-t dark:border-white/10">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Teknik Notlar ve Destek</h3>
                          
                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Teknik Notlar</label>
                            <textarea 
                              name="technicalNotes"
                              defaultValue={tool.technicalNotes || ""}
                              placeholder="Teknik notlarınızı buraya yazın..."
                              className="w-full p-3 border rounded-xl h-24 dark:bg-[#171719] dark:border-white/10"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Backup Stratejisi</label>
                            <input 
                              name="backupStrategy"
                              type="text" 
                              defaultValue={tool.backupStrategy || ""}
                              placeholder="Örn: Günlük otomatik backup"
                              className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Dokümantasyon</label>
                            <input 
                              name="documentation"
                              type="text" 
                              defaultValue={tool.documentation || ""}
                              placeholder="Örn: Detaylı kullanım kılavuzu"
                              className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                            />
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Destek Seviyesi</label>
                            <select 
                              name="supportLevel"
                              defaultValue={tool.supportLevel || ""}
                              className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                            >
                              <option value="">Seçiniz</option>
                              <option value="basic">Basic</option>
                              <option value="standard">Standard</option>
                              <option value="premium">Premium</option>
                              <option value="enterprise">Enterprise</option>
                            </select>
                          </div>

                          <div className="flex flex-col gap-2">
                            <label className="text-sm font-medium">Ölçeklenebilirlik Seçenekleri</label>
                            <input 
                              name="scalabilityOptions"
                              type="text" 
                              defaultValue={tool.scalabilityOptions || ""}
                              placeholder="Örn: Horizontal scaling, load balancing"
                              className="w-full p-3 border rounded-xl dark:bg-[#171719] dark:border-white/10"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 pt-6 bottom-0 pb-4 flex-shrink-0 sticky bottom-0 bg-white dark:bg-[#17191a] z-20">
                          <Button
                            type="submit"
                            className="bg-[#171719] border border-white/10 dark:bg-[#131313] dark:hover:bg-[#171719] text-white px-6 py-3 rounded-xl hover:opacity-90 flex-1 font-medium"
                          >
                            Update Tool
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsEditSheetOpen(false)}
                            className="border border-gray-300 dark:border-white/10 px-6 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#171719] flex-1 font-medium"
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="flex w-full flex-col gap-y-4 pb-8">
            {/* Tool Details */}
            <div className="flex w-full flex-col divide-y divide-gray-200 rounded-xl border border-gray-200 bg-transparent p-0 dark:divide-gray-700 dark:border-[#313131] dark:bg-[#17191a] md:rounded-3xl lg:rounded-4xl">
              <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 md:gap-1">
                  <h3 className="text-md">Tool Information</h3>
                  <div className="flex flex-col gap-4">
                    <div>
                      <h4 className="text-sm font-medium">{tool.name}</h4>
                      <p className="text-sm text-green-600">{formatPrice(tool.price)}</p>
                    </div>
                    <div>
                      <h5 className="text-sm font-medium mb-2">Description</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* n8n Automation Details */}
            <div className="flex w-full flex-col divide-y divide-gray-200 rounded-xl border border-gray-200 bg-transparent p-0 dark:divide-gray-700 dark:border-[#313131] dark:bg-[#17191a] md:rounded-3xl lg:rounded-4xl">
              <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 md:gap-1">
                  <h3 className="text-md">n8n Automation Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Automation Type</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{tool.automationType || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Trigger Type</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{tool.triggerType || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Complexity</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{tool.complexity || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Execution Frequency</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{tool.executionFrequency || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Data Volume</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{tool.dataVolume || 'Not specified'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Deployment Type</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{tool.deploymentType || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Integrations & Technical Details */}
            <div className="flex w-full flex-col divide-y divide-gray-200 rounded-xl border border-gray-200 bg-transparent p-0 dark:divide-gray-700 dark:border-[#313131] dark:bg-[#17191a] md:rounded-3xl lg:rounded-4xl">
              <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 md:gap-1">
                  <h3 className="text-md">Integrations & Technical Details</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Integrations</h4>
                      <div className="flex flex-wrap gap-2">
                        {tool.integrations.map((integration, index) => (
                          <Badge key={index} variant="secondary">{integration}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-1">API Connections</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tool.apiConnections || 0}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Webhook Endpoints</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tool.webhookEndpoints || 0}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-1">Data Transformations</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tool.dataTransformations || 0}</p>
                      </div>
                    </div>
                    {tool.customRequirements && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Custom Requirements</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tool.customRequirements}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Features & Services */}
            <div className="flex w-full flex-col divide-y divide-gray-200 rounded-xl border border-gray-200 bg-transparent p-0 dark:divide-gray-700 dark:border-[#313131] dark:bg-[#17191a] md:rounded-3xl lg:rounded-4xl">
              <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 md:gap-1">
                  <h3 className="text-md">Features & Services</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Features</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {tool.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">{feature}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-2">Optional Addons</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {tool.optionalAddons.map((addon, index) => (
                          <li key={index} className="text-sm text-gray-600 dark:text-gray-400">{addon}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={tool.errorHandling} readOnly className="rounded" />
                        <span className="text-sm">Error Handling</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={tool.monitoring} readOnly className="rounded" />
                        <span className="text-sm">Monitoring</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={tool.testingIncluded} readOnly className="rounded" />
                        <span className="text-sm">Testing Included</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={tool.trainingIncluded} readOnly className="rounded" />
                        <span className="text-sm">Training Included</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Notes & Support */}
            <div className="flex w-full flex-col divide-y divide-gray-200 rounded-xl border border-gray-200 bg-transparent p-0 dark:divide-gray-700 dark:border-[#313131] dark:bg-[#17191a] md:rounded-3xl lg:rounded-4xl">
              <div className="flex flex-col gap-6 p-4 md:p-8">
                <div className="flex flex-col gap-4 md:gap-1">
                  <h3 className="text-md">Technical Notes & Support</h3>
                  <div className="space-y-4">
                    {tool.technicalNotes && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Technical Notes</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tool.technicalNotes}</p>
                      </div>
                    )}
                    {tool.backupStrategy && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Backup Strategy</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tool.backupStrategy}</p>
                      </div>
                    )}
                    {tool.documentation && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Documentation</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tool.documentation}</p>
                      </div>
                    )}
                    {tool.supportLevel && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Support Level</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tool.supportLevel}</p>
                      </div>
                    )}
                    {tool.scalabilityOptions && (
                      <div>
                        <h4 className="text-sm font-medium mb-1">Scalability Options</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{tool.scalabilityOptions}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Customer Sidebar */}
      <div className="hidden w-full max-w-[320px] overflow-y-auto rounded-none border-none bg-transparent md:block xl:max-w-[440px] dark:bg-transparent">
        <div className="flex h-full flex-col gap-2 overflow-y-auto">
          <div className="w-full rounded-xl border border-gray-200 bg-white p-6 dark:border-[#313131] dark:bg-[#17191a] lg:rounded-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-md">Tool Summary</h3>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Base Price</span>
                    <span className="text-sm font-medium">{formatPrice(tool.price)}</span>
                  </div>
                  {tool.maintenanceRequired && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Maintenance</span>
                      <span className="text-sm font-medium">₺{tool.maintenancePrice}</span>
                    </div>
                  )}
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold">
                      <span className="text-sm">Total</span>
                      <span className="text-sm">{formatPrice(tool.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full rounded-xl border border-gray-200 bg-white p-6 dark:border-[#313131] dark:bg-[#17191a] lg:rounded-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-md">Tool Information</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Created</span>
                    <p className="text-sm font-medium">{formatDate(tool.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Last Updated</span>
                    <p className="text-sm font-medium">{formatDate(tool.updatedAt)}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tool ID</span>
                    <p className="text-sm font-medium font-mono">{tool.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="w-full rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900 lg:rounded-2xl">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">Actions</h3>
                <div className="flex flex-col gap-3">
                  <button className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                    Duplicate Tool
                  </button>
                  <button className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
                    Export Configuration
                  </button>
                  <button className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30">
                    Delete Tool
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
