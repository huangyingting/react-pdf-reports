import React from 'react';
import './W2Form.css';
import { W2 } from '../../utils/zodSchemas';

interface W2FormProps {
  data: W2;
  fontFamily?: string;
}

const W2Form: React.FC<W2FormProps> = ({ data, fontFamily = "'Courier New', monospace" }) => {
  return (
    <div
      className="w2-report"
      id="w2-report"
      style={{ fontFamily: fontFamily }}
    >
      <div className="w2-page">
        <div className="w2-form">
          {/* Void checkbox */}
          <div className="w2-void">
            <input type="checkbox" readOnly />
            <span>VOID</span>
          </div>

          {/* Top section with identifiers */}
          <div className="w2-top-section">
            {/* Left column - boxes a, b, c, d */}
            <div className="w2-left-column">
              <div className="w2-box w2-box-a">
                <div className="w2-box-label">a Employee's social security number</div>
                <div className="w2-box-value">{data.employeeSSN}</div>
              </div>
              
              <div className="w2-box-group-horiz">
                <div className="w2-box w2-box-b">
                  <div className="w2-box-label">b Employer identification number (EIN)</div>
                  <div className="w2-box-value">{data.employerEIN}</div>
                </div>
              </div>

              <div className="w2-box w2-box-c">
                <div className="w2-box-label">c Employer's name, address, and ZIP code</div>
                <div className="w2-box-value w2-multiline">
                  <div>{data.employerName}</div>
                  <div>{data.employerAddress.street}</div>
                  <div>{data.employerAddress.city}, {data.employerAddress.state} {data.employerAddress.zipCode}</div>
                </div>
              </div>

              <div className="w2-box w2-box-d">
                <div className="w2-box-label">d Control number</div>
                <div className="w2-box-value">{data.controlNumber || ''}</div>
              </div>

              <div className="w2-box w2-box-e">
                <div className="w2-box-label">e Employee's first name and initial</div>
                <div className="w2-box-value">{data.employeeName}</div>
              </div>

              <div className="w2-box w2-box-f">
                <div className="w2-box-label">f Employee's address and ZIP code</div>
                <div className="w2-box-value w2-multiline">
                  <div>{data.employeeAddress.street}</div>
                  <div>{data.employeeAddress.city}, {data.employeeAddress.state} {data.employeeAddress.zipCode}</div>
                </div>
              </div>
            </div>

            {/* Right column - Form identification */}
            <div className="w2-right-header">
              <div className="w2-form-info">
                <div className="w2-omb">OMB No. 1545-0008</div>
              </div>
              <div className="w2-safe-box">
                <div className="w2-safe-label">Safe, accurate,</div>
                <div className="w2-safe-label">FAST! Use</div>
                <div className="w2-efile">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                  </svg>
                  IRS e-file
                </div>
              </div>
              <div className="w2-form-number-box">
                <div className="w2-form-number">Form W-2</div>
                <div className="w2-form-title">Wage and Tax<br/>Statement</div>
                <div className="w2-year-box">{data.taxYear}</div>
                <div className="w2-copy-label">Copy B—To Be Filed With Employee's FEDERAL Tax Return.</div>
                <div className="w2-instruction">This information is being furnished to the Internal Revenue Service.</div>
              </div>
            </div>
          </div>

          {/* Numbered boxes section */}
          <div className="w2-numbered-boxes">
            {/* Row 1: Boxes 1 and 2 */}
            <div className="w2-box-row">
              <div className="w2-box w2-box-1">
                <div className="w2-box-label">1 Wages, tips, other compensation</div>
                <div className="w2-box-value">{data.wages}</div>
              </div>
              <div className="w2-box w2-box-2">
                <div className="w2-box-label">2 Federal income tax withheld</div>
                <div className="w2-box-value">{data.federalIncomeTaxWithheld}</div>
              </div>
            </div>

            {/* Row 2: Boxes 3 and 4 */}
            <div className="w2-box-row">
              <div className="w2-box w2-box-3">
                <div className="w2-box-label">3 Social security wages</div>
                <div className="w2-box-value">{data.socialSecurityWages}</div>
              </div>
              <div className="w2-box w2-box-4">
                <div className="w2-box-label">4 Social security tax withheld</div>
                <div className="w2-box-value">{data.socialSecurityTaxWithheld}</div>
              </div>
            </div>

            {/* Row 3: Boxes 5 and 6 */}
            <div className="w2-box-row">
              <div className="w2-box w2-box-5">
                <div className="w2-box-label">5 Medicare wages and tips</div>
                <div className="w2-box-value">{data.medicareWages}</div>
              </div>
              <div className="w2-box w2-box-6">
                <div className="w2-box-label">6 Medicare tax withheld</div>
                <div className="w2-box-value">{data.medicareTaxWithheld}</div>
              </div>
            </div>

            {/* Row 4: Boxes 7 and 8 */}
            <div className="w2-box-row">
              <div className="w2-box w2-box-7">
                <div className="w2-box-label">7 Social security tips</div>
                <div className="w2-box-value">{data.socialSecurityTips || ''}</div>
              </div>
              <div className="w2-box w2-box-8">
                <div className="w2-box-label">8 Allocated tips</div>
                <div className="w2-box-value">{data.allocatedTips || ''}</div>
              </div>
            </div>

            {/* Row 5: Box 9 (blank) and 10 */}
            <div className="w2-box-row">
              <div className="w2-box w2-box-9">
                <div className="w2-box-label">9</div>
                <div className="w2-box-value"></div>
              </div>
              <div className="w2-box w2-box-10">
                <div className="w2-box-label">10 Dependent care benefits</div>
                <div className="w2-box-value">{data.dependentCareBenefits || ''}</div>
              </div>
            </div>

            {/* Row 6: Box 11 and 12/13 combined */}
            <div className="w2-box-row">
              <div className="w2-box w2-box-11">
                <div className="w2-box-label">11 Nonqualified plans</div>
                <div className="w2-box-value">{data.nonqualifiedPlans || ''}</div>
              </div>
              <div className="w2-box-12-13-wrapper">
                <div className="w2-box w2-box-12">
                  <div className="w2-box-label">12a See instructions for box 12</div>
                  <div className="w2-box-12-codes">
                    {data.box12Codes && data.box12Codes.map((item, index) => (
                      <div key={index} className="w2-box-12-code-row">
                        <span className="w2-code-letter">{String.fromCharCode(97 + index)}</span>
                        <span className="w2-code-box">{item.code}</span>
                        <span className="w2-code-amount">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w2-box w2-box-13">
                  <div className="w2-box-label">13</div>
                  <div className="w2-box-13-checks">
                    <label>
                      <input type="checkbox" checked={data.statutoryEmployee || false} readOnly />
                      Statutory<br/>employee
                    </label>
                    <label>
                      <input type="checkbox" checked={data.retirementPlan || false} readOnly />
                      Retirement<br/>plan
                    </label>
                    <label>
                      <input type="checkbox" checked={data.thirdPartySickPay || false} readOnly />
                      Third-party<br/>sick pay
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 7: Box 14 (Other) */}
            <div className="w2-box-row">
              <div className="w2-box w2-box-14">
                <div className="w2-box-label">14 Other</div>
                <div className="w2-box-value"></div>
              </div>
            </div>

            {/* State and Local Information Row */}
            <div className="w2-state-local-row">
              <div className="w2-box w2-box-15">
                <div className="w2-box-label">15 State</div>
                <div className="w2-box-value">{data.employeeAddress.state}</div>
              </div>
              <div className="w2-box w2-box-15b">
                <div className="w2-box-label">Employer's state ID number</div>
                <div className="w2-box-value">{data.employerEIN.split('-')[0] + data.employerEIN.split('-')[1].substring(0, 4)}</div>
              </div>
              <div className="w2-box w2-box-16">
                <div className="w2-box-label">16 State wages, tips, etc.</div>
                <div className="w2-box-value">{data.stateWages || data.wages}</div>
              </div>
              <div className="w2-box w2-box-17">
                <div className="w2-box-label">17 State income tax</div>
                <div className="w2-box-value">{data.stateIncomeTax || ''}</div>
              </div>
              <div className="w2-box w2-box-18">
                <div className="w2-box-label">18 Local wages, tips, etc.</div>
                <div className="w2-box-value">{data.localWages || ''}</div>
              </div>
              <div className="w2-box w2-box-19">
                <div className="w2-box-label">19 Local income tax</div>
                <div className="w2-box-value">{data.localIncomeTax || ''}</div>
              </div>
              <div className="w2-box w2-box-20">
                <div className="w2-box-label">20 Locality name</div>
                <div className="w2-box-value">{data.localityName || ''}</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="w2-footer">
            <div className="w2-footer-left">
              Form <strong>W-2</strong> Department of the Treasury—Internal Revenue Service
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default W2Form;
