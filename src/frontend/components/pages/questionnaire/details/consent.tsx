import React, { FormEvent } from "react";
import { WithRouterProps } from "next/dist/client/with-router";
import { withRouter } from "next/router";
import { Translation } from "react-i18next";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import Checkbox from "@material-ui/core/Checkbox";
import classNames from "classnames";

import Questionnaire from "../questionnaire";
import { ConsentInfo } from "src/common/notify-function-input";
import { ConsentContext } from "src/frontend/components/stores/consent-store";
import { Details } from "src/frontend/components/stores/details-store";
import { Results } from "src/frontend/components/stores/results-store";

import Styles from "./details.module.scss";

type Props = {
  details: Details;
  results: Results;
} & WithRouterProps;

function Consent(props: Props) {
  return (
    <Questionnaire details={props.details} results={props.results}>
      {(questions, questionNumber) => (
        <Translation ns={["default"]}>
          {t => (
            <ConsentContext.Consumer>
              {consent => {
                const onSubmit = (event: FormEvent) => {
                  event.preventDefault();

                  if (consent.validate()) {
                    consent.save();
                    props.router.push("/questionnaire/details");
                  }
                };

                return (
                  <React.Fragment>
                    {/* TODO: Translate */}
                    <div>
                      <h4>1. What is the research study about?</h4>
                      <p>
                        This is an invitation for you and your child in your
                        care to take part in this research project, which is
                        called “A multistate trial of an early surveillance
                        program for autism within General Practices in
                        Australia”. You have been invited to participate because
                        the General Practitioner (GP) your child is seeing is
                        participating in this study and all patients attending
                        the GP practice with a child aged between 18-24 months
                        are being invited to participate in the study.
                      </p>
                    </div>

                    <div>
                      <h4>2. Who is conducting this research?</h4>
                      <p>
                        The study is being carried out by the following
                        researchers:
                        <br />
                        UNSW: Professor Valsamma Eapen, Dr Anne Masi, Feroza
                        Khan (School of Psychiatry, Faculty of Medicine, UNSW),
                        and Dr Aline Smith (The Academic Primary and Integrated
                        Care Unit (APICU)).
                        <br /> La Trobe University: Dr Josephine Barbaro,
                        Professor Cheryl Dissanayake, Dr Melissa Gilbert, and Ms
                        Radhika Nair (Olga Tennison Autism Research Centre
                        (OTARC)).
                        <br /> This research is being funded by the Autism
                        Cooperative Research Centre (Autism CRC).
                      </p>
                    </div>

                    <div>
                      <h4>3. Inclusion/Exclusion Criteria</h4>
                      <p>
                        Before you decide to allow your child to participate in
                        this research project, we need to ensure that it is ok
                        for your child to take part. The research study is
                        looking for children that are between the ages of
                        approximately 18 and 24 months attending the GP practice
                        for any reason (a “universal approach”).
                      </p>
                    </div>

                    <div>
                      <h4>4. Do I have to take part in this research study?</h4>
                      <p>
                        Participation in this research study is voluntary. If
                        you or your child does not want to take part, you do not
                        have to. If you decide to take part and later change
                        your mind, you are free to withdraw from the study at
                        any stage and this will not in any way affect the care
                        of your child or family with the GP or any other listed
                        organisation.
                      </p>
                      <p>
                        If you decide you want to take part in the research
                        study, you will be asked to:
                      </p>
                      <ul>
                        <li>
                          Read the information carefully (ask questions if
                          necessary)
                        </li>
                        <li>
                          Sign and return the consent form if you decide to
                          participate in the study
                        </li>
                        <li>Take a copy of this form with you to keep.</li>
                      </ul>
                    </div>

                    <div>
                      <h4>
                        5. What does participation in this research require, and
                        are there any risks involved?
                      </h4>

                      <p>
                        If you consent for your child to take part in the
                        research study, we will ask you to do three things:
                      </p>

                      <p>
                        1.{" "}
                        <u>
                          When your child is approximately 18 months to 24
                          months
                        </u>
                        : In addition to activities and assessments that are
                        part of standard clinical care, as part of this research
                        project we will ask you to complete online and/or
                        paper-based questionnaires while in the waiting room of
                        your GP. The questionnaires will ask you about your
                        child’s behaviour and any concerns you may have about
                        their development including language, fine motor, gross
                        motor and social skills development. These
                        questionnaires should take approximately 10 minutes to
                        complete. Your GP or the Practice Nurse (PN) will also
                        complete an interview with you about your child’s
                        development which will take approximately 10-15 minutes.
                        If the GP or PN identify a developmental concern, the
                        researcher will also complete an additional
                        questionnaire with you about your child’s development
                        which will take 5 minutes.
                      </p>

                      <p>
                        2. <u>When your child is approximately 2 years</u>: We
                        will be asking some families to attend a follow-up
                        face-to-face appointment when their child is
                        approximately 2 years of age. In this appointment your
                        child will participate in a series of child-friendly
                        play-based tasks to assess your child’s social attention
                        and communication and cognitive development. We will ask
                        to video-tape the session with your child for later
                        analysis, if required. If you provide us with a USB, we
                        will be happy to make a copy of the sessions for you. As
                        part of this assessment we will also ask you to answer
                        some questions about your child. The child assessment
                        and parent questions will take approximately 2 to 3
                        hours to complete, which may be divided over more than
                        one session if needed. You will be provided with a
                        written report after the appointment as a summary of
                        your child’s developmental abilities and we will assist
                        you with any further assessments or support as needed.
                      </p>

                      <p>
                        3. <u>When your child is approximately 30 months old</u>
                        : We will be asking all families participating in the
                        study to complete a questionnaire about their child’s
                        social development. This questionnaire will take
                        approximately 15 minutes to complete. For those
                        identified with a developmental disorder, there will
                        also be a semi-structured questionnaire to evaluate the
                        uptake of recommendations, experience of
                        assessment/service use, disability supports, and early
                        intervention received and parental satisfaction with the
                        health and disability services. This semi-structured
                        questionnaire will take approximately 5 minutes to
                        complete.
                      </p>

                      <p>
                        Participants who complete both the face-to-face
                        appointment and the assessment at 30 months will receive
                        a $30 Coles Myer gift voucher. The voucher will be
                        posted or emailed to participants after completion of
                        the assessment at 30 months. The practice will be given
                        $500 to help with conducting the study for practice
                        staff time.
                      </p>

                      <p>
                        There are no major risks associated with this project.
                        However, if you experience discomfort or feelings of
                        distress while participating in the research and you
                        require support, you can stop participating at any time.
                        You can also tell a member of the research team and they
                        will provide you with assistance or alternatively a list
                        of locally available support services and their contact
                        details.
                      </p>
                    </div>

                    <div>
                      <h4>
                        6. What are the possible benefits to participation?
                      </h4>
                      <p>
                        We hope to use information we get from this research
                        study to benefit others by ensuring that early
                        identification of children with autism spectrum disorder
                        (ASD) occurs as early diagnosis and early intervention
                        can assist children with ASD to reach their optimum
                        potential and enhance school readiness.
                      </p>
                    </div>

                    <div>
                      <h4>7. What will happen to information about me?</h4>
                      <p>
                        By signing the consent form you consent to the research
                        team collecting and using information about your child
                        for the research study. We are required to keep the data
                        from this study until at least the time of your child’s
                        25th birthday. We also ask your permission to keep the
                        data indefinitely in case they are of benefit to use in
                        future research studies. The information gathered may be
                        used in any future research projects undertaken by the
                        research team at the University of NSW and Olga Tennison
                        Autism Research Centre, and you can indicate your
                        preferences for the use of your information on the
                        attached Consent Form.
                      </p>
                      <p>
                        The scope for future use of this research data is
                        currently unknown as developmental and psychological
                        science advances quickly. We are not in a position to
                        tell you exactly what form future research might take,
                        or the outcomes of that research. Future research might
                        involve asking different questions of the data, or even
                        recontacting you to find out how your child is doing in
                        future. Any time there is a request for the data to be
                        used in a project that is unrelated to this current
                        project, approval from a Human Research Ethics Committee
                        will be required prior to use of the data. No research
                        will take place using your information unless that
                        research is first reviewed and approved by a Human
                        Research Ethics Committee, which will make sure the
                        benefits of the research outweigh the costs to you and
                        your privacy. Information about your child will be
                        released in a way that will not identify them, unless
                        the project involves recontacting you to find out how
                        your child is doing. We will store information about
                        your child in a non-identifiable format and UNSW Sydney
                        Electronic data will be stored in password protected
                        files on UNSW OneDrive and REDCap.
                      </p>
                      <p>
                        The information you provide is personal information for
                        the purposes of the Privacy and Personal Information
                        Protection Act 1998 (NSW). You have the right of access
                        to personal information held about you by the
                        University, the right to request correction and
                        amendment of it, and the right to make a complaint about
                        a breach of the Information Protection Principles as
                        contained in the PPIP Act. Further information on how
                        the University protects personal information is
                        available in the{" "}
                        <a
                          href="https://www.legal.unsw.edu.au/compliance/privacyhome.html"
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          UNSW Privacy Management Plan
                        </a>
                        .
                      </p>
                    </div>

                    <div>
                      <h4>
                        8. How and when will I find out what the results of the
                        research study are?
                      </h4>
                      <p>
                        The research team intend to publish and/ report the
                        results of the research study in a variety of ways. All
                        information published will be done in a way that will
                        not identify you or your child. If you would like to
                        receive a copy of the results you can let the research
                        team know by adding your email within the consent form.
                        We will only use these details to send you the results
                        of the research.
                      </p>
                    </div>

                    <div>
                      <h4>
                        9. What if I want to withdraw from the research study?
                      </h4>
                      <p>
                        If you and your child do consent to participate, you may
                        withdraw at any time. You can do so by completing the
                        ‘Withdrawal of Consent Form’ which is provided at the
                        end of this document. Alternatively, you can ring the
                        research team and tell them you no longer want your
                        child to participate. Your decision not to participate
                        or to withdraw your child from the study will not affect
                        your relationship with UNSW Sydney, La Trobe University,
                        the Autism CRC, or your GP.
                      </p>
                      <p>
                        If you decide to leave the research study, the
                        researchers will not collect additional information from
                        you or your child. Any identifiable information about
                        you or your child will be withdrawn from the research
                        project.
                      </p>
                    </div>

                    <div>
                      <h4>
                        10. What should I do if I have further questions about
                        my involvement in the research study?
                      </h4>
                      <p>
                        The person you may need to contact will depend on the
                        nature of your query. If you want any further
                        information concerning this project or if you have any
                        problems which may be related to your involvement in the
                        project, you can contact the following member/s of the
                        research team:
                      </p>
                      <table>
                        <tbody>
                          <tr>
                            <th>Name</th>
                            <td>Feroza Khan</td>
                          </tr>
                          <tr>
                            <th>Position</th>
                            <td>Research Officer</td>
                          </tr>
                          <tr>
                            <th>Telephone</th>
                            <td>0491 137 235</td>
                          </tr>
                          <tr>
                            <th>Email</th>
                            <td>feroza.khan@unsw.edu.au</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h4>11. Support Services Contact Details</h4>
                      <p>
                        If at any stage during the project you or your child
                        becomes distressed or require additional support from
                        someone not involved in the research, we will assist you
                        in seeking an appointment with your GP or local
                        community health nurse.
                      </p>
                      <p>Other services you may wish to contact:</p>
                      <ul>
                        <li>
                          Healthdirect Australia (nurse on call): 1800 022 222
                        </li>
                        <li>Karitane: 1300 CARING | (1300 227 464)</li>
                        <li>
                          Raising Children Network:{" "}
                          <a href="https://raisingchildren.net.au">
                            raisingchildren.net.au
                          </a>
                        </li>
                        <li>
                          Tresillian Family Care Centres: 1 300 2 PARENT | (Free
                          call outside Sydney metro area) | Sydney metro area:
                          (02) 9787 0855
                        </li>
                        <li>
                          Parentworks:{" "}
                          <a href="https://parentworks.org.au">
                            parentworks.org.au
                          </a>
                        </li>
                        <li>
                          Lifeline: 13 11 14{" "}
                          <a href="https://lifeline.org.au">lifeline.org.au</a>
                        </li>
                        <li>
                          Perinatal mental health (including postnatal
                          depression): 1300 726 306{" "}
                          <a href="https://panda.org.au">panda.org.au</a>
                        </li>
                        <li>
                          Men’s Helpline: 1300 78 99 78{" "}
                          <a href="https://mensline.org.au">mensline.org.au</a>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4>
                        12. What if I have a complaint or any concerns about the
                        research study?
                      </h4>
                      <p>
                        If you have any complaints about any aspect of the
                        project, the way it is being conducted, then you may
                        contact:
                      </p>
                      <p>
                        <strong>Complaints Contact</strong>
                      </p>

                      <table>
                        <tbody>
                          <tr>
                            <th>Position</th>
                            <td>UNSW Human Research Ethics Coordinator</td>
                          </tr>
                          <tr>
                            <th>Telephone</th>
                            <td>+ 61 2 9385 6222</td>
                          </tr>
                          <tr>
                            <th>Email</th>
                            <td>
                              <a href="mailto:humanethics@unsw.edu.au">
                                humanethics@unsw.edu.au
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <th>HC Reference</th>
                            <td>HC190143</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <form
                      className={classNames(Styles["consent-form"])}
                      onSubmit={onSubmit}
                    >
                      <div className={Styles.details}>
                        <FormControlLabel
                          className={classNames(
                            Styles["field-wrapper"],
                            Styles.flex,
                            {
                              [Styles.error]: consent.errors.understandConsent
                            }
                          )}
                          control={
                            <Checkbox
                              className={Styles["align-self-start"]}
                              checked={consent.consent.understandConsent}
                              required={true}
                              aria-invalid={consent.errors.understandConsent}
                              onChange={(e, value) =>
                                consent.setUnderstandConsent(value)
                              }
                              value="understandConsent"
                            />
                          }
                          label={t("consent.understandConsent")}
                        />

                        <FormControlLabel
                          className={classNames(
                            Styles["field-wrapper"],
                            Styles.flex,
                            {
                              [Styles.error]: consent.errors.infoSheet
                            }
                          )}
                          control={
                            <Checkbox
                              className={Styles["align-self-start"]}
                              checked={consent.consent.infoSheet}
                              required={true}
                              aria-invalid={consent.errors.infoSheet}
                              onChange={(e, value) =>
                                consent.setInfoSheet(value)
                              }
                              value="infoSheet"
                            />
                          }
                          label={t("consent.infoSheet")}
                        />

                        <FormControlLabel
                          className={classNames(
                            Styles["field-wrapper"],
                            Styles.flex,
                            {
                              [Styles.error]: consent.errors.understandAim
                            }
                          )}
                          control={
                            <Checkbox
                              className={Styles["align-self-start"]}
                              checked={consent.consent.understandAim}
                              required={true}
                              aria-invalid={consent.errors.understandAim}
                              onChange={(e, value) =>
                                consent.setUnderstandAim(value)
                              }
                              value="understandAim"
                            />
                          }
                          label={t("consent.understandAim")}
                        />

                        <FormControlLabel
                          className={classNames(
                            Styles["field-wrapper"],
                            Styles.flex,
                            {
                              [Styles.error]: consent.errors.opportunityToAsk
                            }
                          )}
                          control={
                            <Checkbox
                              className={Styles["align-self-start"]}
                              checked={consent.consent.opportunityToAsk}
                              required={true}
                              aria-invalid={consent.errors.opportunityToAsk}
                              onChange={(e, value) =>
                                consent.setOpportunityToAsk(value)
                              }
                              value="opportunityToAsk"
                            />
                          }
                          label={t("consent.opportunityToAsk")}
                        />

                        <FormControlLabel
                          className={classNames(
                            Styles["field-wrapper"],
                            Styles.flex,
                            {
                              [Styles.error]: consent.errors.agreeToParticipate
                            }
                          )}
                          control={
                            <Checkbox
                              className={Styles["align-self-start"]}
                              checked={consent.consent.agreeToParticipate}
                              required={true}
                              aria-invalid={consent.errors.agreeToParticipate}
                              onChange={(e, value) =>
                                consent.setAgreeToParticipate(value)
                              }
                              value="agreeToParticipate"
                            />
                          }
                          label={t("consent.agreeToParticipate")}
                        />

                        <FormControlLabel
                          className={classNames(
                            Styles["field-wrapper"],
                            Styles.flex
                          )}
                          control={
                            <Checkbox
                              className={Styles["align-self-start"]}
                              checked={consent.consent.receiveCopy}
                              onChange={(e, value) =>
                                consent.setReceiveCopy(value)
                              }
                              value="receiveResults"
                            />
                          }
                          label={t("consent.receiveResults")}
                        />

                        {/* <p className={Styles.paragraph}></p> */}

                        <FormControl
                          className={classNames(Styles["field-wrapper"], {
                            [Styles.error]: consent.errors.info
                          })}
                          error={consent.errors.info}
                          component={"fieldset" as "abbr"}
                        >
                          <FormLabel
                            component={"legend" as "abbr"}
                            className={Styles.paragraph}
                          >
                            I understand that I will be given a signed copy of
                            this document to keep; I would like my information
                            collected for this research study to be:
                          </FormLabel>
                          <RadioGroup
                            aria-label="I would like my information collected for this research study to be:"
                            name="info"
                            value={consent.consent.info}
                            aria-invalid={consent.errors.understandConsent}
                            onChange={(event, value) =>
                              consent.setInfo(value as ConsentInfo)
                            }
                          >
                            <FormControlLabel
                              className={classNames(Styles.flex)}
                              value="studyOnly"
                              control={
                                <Radio
                                  required
                                  className={Styles["align-self-start"]}
                                />
                              }
                              label="Only used for this specific study"
                            />
                            <FormControlLabel
                              className={classNames(Styles.flex)}
                              value="futureRelated"
                              control={
                                <Radio
                                  required
                                  className={Styles["align-self-start"]}
                                />
                              }
                              label="Used for future related studies and provide permission for my child’s data to be stored and shared for future research purposes"
                            />
                            <FormControlLabel
                              className={classNames(Styles.flex)}
                              value="futureAny"
                              control={
                                <Radio
                                  required
                                  className={Styles["align-self-start"]}
                                />
                              }
                              label="Used for any future studies and provide permission for my child’s data to be stored and shared for future research purposes"
                            />
                          </RadioGroup>
                        </FormControl>
                      </div>

                      <div className={Styles["field-wrapper"]}>
                        <input
                          type="submit"
                          className={Styles["next-button"]}
                          value={t("app.next").toString()}
                        />
                      </div>
                    </form>
                  </React.Fragment>
                );
              }}
            </ConsentContext.Consumer>
          )}
        </Translation>
      )}
    </Questionnaire>
  );
}

export default withRouter(Consent);
